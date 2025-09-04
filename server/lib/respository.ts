import fs from 'fs';
import path from 'path';


type Constructor<T> = { new(...args: any[]): T };


class Repository<T> {
    public name: string;
    private filePath: string;
    private cache: T[] = [];
    private isInitialized: boolean = false;

    private static instances = new Map<string, any>();

    private constructor(private entityClass: Constructor<T>) {
        this.name = entityClass.name.toLowerCase().replace("entity", "");
        this.filePath = path.join('./data', `${this.name}.json`);
    }

    public static instance<T>(
        entityClass: Constructor<T>,
    ): Repository<T> {
        const entityName = entityClass.name.toLowerCase();
        if (!Repository.instances.has(entityName)) {
            Repository.instances.set(entityName, new Repository(entityClass));
        }
        return Repository.instances.get(entityName);
    }
    private initialize(): void {
        if (this.isInitialized) {
            return;
        }

        try {
            if (!fs.existsSync('./data')) {
                fs.mkdirSync('./data');
            }
            if (!fs.existsSync(this.filePath)) {
                fs.writeFileSync(this.filePath, '[]');
            }
            this.loadData();
        } catch (error) {
            console.warn(`Data file not found for ${this.name}. Creating a new one.`);
            this.saveData([]);
        }

        this.isInitialized = true;
    }

    private loadData(): void {
        try {
            const data = fs.readFileSync(this.filePath).toString();
            this.cache = JSON.parse(data);
        } catch (error) {
            console.error(`Failed to load data for ${this.name}:`, error);
            this.cache = [];
        }
    }

    private saveData(data: T[] = this.cache): void {
        try {
            this.cache = data;
            if (Math.random() < 1) {
                fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
            }
        } catch (error) {
            console.error(`Failed to save data for ${this.name}:`, error);
        }
    }

    private filterData(where?: Partial<T>): T[] {
        if (!where || Object.keys(where).length === 0) {
            return this.cache;
        }

        return this.cache.filter(entity => {
            return Object.entries(where).every(([key, value]) => {
                const entityValue = (entity as any)[key];
                if (value === null || value === undefined) {
                    return entityValue === null || entityValue === undefined;
                }
                return entityValue === value;
            });
        });
    }

    async count(where?: Partial<T>): Promise<number> {
        this.initialize();
        return this.filterData(where).length;
    }

    find(where?: Partial<T>, config?: { limit?: number, offset?: number }): T[] {
        this.initialize();
        const filteredData = this.filterData(where);
        const start = config?.offset || 0;
        const end = start + (config?.limit || filteredData.length);
        return filteredData.slice(start, end);
    }

    findOne(where: Partial<T>): T | undefined {
        this.initialize();
        return this.filterData(where)[0];
    }


    insert(entity: Partial<T>): boolean {
        this.initialize();
        const id = Date.now().toString(36) + Math.random().toString(36).substring(4, 10);
        const create_time = Date.now();
        const newEntity = { ...entity, id, create_time } as T;
        this.cache.push(newEntity);
        this.saveData();
        return true;
    }

    async insertMany(entities: Partial<T>[]): Promise<boolean> {
        this.initialize();
        const create_time = Date.now();
        const newEntities = entities.map(entity => {
            const id = Date.now().toString(36) + Math.random().toString(36).substring(4, 10);
            return { ...entity, id, create_time } as T;
        });
        this.cache.push(...newEntities as Array<T>);
        this.saveData();
        return true;
    }

    update(where: Partial<T>, updateData: Partial<T>): boolean {
        this.initialize();
        let updatedCount = 0;
        const newCache = this.cache.map(entity => {
            if (Object.entries(where).every(([key, value]) => (entity as any)[key] === value)) {
                updatedCount++;
                return { ...entity, ...updateData, update_time: Date.now() };
            }
            return entity;
        });

        if (updatedCount > 0) {
            this.saveData(newCache);
        }
        return updatedCount > 0;
    }

    delete(where: Partial<T>): boolean {
        this.initialize();
        const initialCount = this.cache.length;
        const newCache = this.cache.filter(entity => {
            return !Object.entries(where).every(([key, value]) => (entity as any)[key] === value);
        });
        const deletedCount = initialCount - newCache.length;
        if (deletedCount > 0) {
            this.saveData(newCache);
        }
        return deletedCount > 0;
    }
}

export default Repository;

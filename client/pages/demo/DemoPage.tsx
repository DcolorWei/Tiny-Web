import { Header } from "../../components/header/Header";
import { useEffect, useState } from "react";
import { DemoImpl } from "../../../shared/impl";
import { DemoRouter, DemoWebsocket } from "../../api/instance";
import { WebSocketClientService } from "../../lib/websocket";

const DemoPage = () => {
    const [DemoList, setAccountList] = useState<Array<DemoImpl>>([]);

    useEffect(() => {
        DemoWebsocket.queryDemo({ name: "demo" });
        window.addEventListener('queryDemo', function (event) {
            const detail: { list: Array<DemoImpl> } = event["detail"];
            setAccountList(detail.list);
        });
    }, [])

    return (
        <div className="max-w-screen">
            <Header name="Demo" />
            <div className="p-4">
                {JSON.stringify(DemoList)}
            </div>
        </div >
    )
};


export default DemoPage;
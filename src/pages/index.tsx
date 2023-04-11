import Head from 'next/head'
import EditGraphView from '../views/EditFlowChartView'

export default function Home() {
    return (
        <div>
            <Head>
                <title>流程编辑</title>
            </Head>
            <EditGraphView />
        </div>
    )
}

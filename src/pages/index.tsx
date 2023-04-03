import Head from 'next/head'
import EditGraphView from '../views/EditFlowChart'
import Link from 'next/link'

export default function Home() {
    return (
        <div>
            <Head>
                <title>首页</title>
            </Head>
            <EditGraphView />
        </div>
    )
}

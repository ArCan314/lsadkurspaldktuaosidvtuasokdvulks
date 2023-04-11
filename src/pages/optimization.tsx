import OptimizationFlowView from '@/views/OptimizationFlowView'
import Head from 'next/head'

export default function Home() {
    return (
        <div>
            <Head>
                <title>流程优化</title>
            </Head>
            <OptimizationFlowView/>
        </div>
    )
}

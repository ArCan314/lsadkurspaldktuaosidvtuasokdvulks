import React, { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import _ from 'lodash';
import { OptimizationResult } from '@/types';
import type EChartsReact from 'echarts-for-react';

// let data = [];
const startTime: number = 0;
const categories: string[] = ['categoryA', 'categoryB', 'categoryC'];
// const colors = ['#7b9ce1', '#bd6d6c', '#75d874', '#e0bc78', '#dc77dc', '#72b362'];
const colors = ['#7b9ce1', '#bd6d6c'];
let dataCopy: Readonly<{userDefinedValue: number}>[] = [];

function renderItem(params, api) {
    let dataIndex = params.dataIndex;
    let categoryIndex = api.value(0);
    let start = api.coord([api.value(1), categoryIndex]);
    let end = api.coord([api.value(2), categoryIndex]);
    let height = api.size([0, 1])[1] * 0.6;
    let rectShape = echarts.graphic.clipRectByRect(
        {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
        },
        {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
        }
    );
    return (
        rectShape && {
            type: 'group',
            children: [
                {
                    type: 'rect',
                    transition: ['shape'],
                    shape: rectShape,
                    style: api.style()
                },
                {
                    type: 'text',
                    x: (start[0] + end[0]) / 2,
                    y: start[1],
                    silent: true,
                    // shape: {
                    //     x: start[0],
                    //     y: start[1] - height / 2,
                    //     transition: ['shape'],
                    // },
                    style: {
                        font: 'bolder 1.3em "Microsoft YaHei", sans-serif',
                        text: dataCopy[dataIndex].userDefinedValue.toString(),
                        textAlign: 'center',
                        textVerticalAlign: 'middle',
                        shadowBlur: 1,
                        shadowColor: 0.2,
                        textFill: 'white',
                        textStroke: 'black',
                    }
                }
            ]
        }
    );
}

const option = {
    tooltip: {
        formatter: function (params) {
            return params.marker + '持续时间: ' + params.value[3] + ' 小时<br/>' +
                params.marker +    '投入数量: ' + dataCopy[params.dataIndex].userDefinedValue + '(单位)';
        }
    },
    title: {
        text: '排产结果',
        left: 'center'
    },
    // dataZoom: [
    //     {
    //         type: 'slider',
    //         filterMode: 'weakFilter',
    //         showDataShadow: false,
    //         top: 400,
    //         labelFormatter: ''
    //     },
    //     {
    //         type: 'inside',
    //         filterMode: 'weakFilter'
    //     }
    // ],
    grid: {
        show: true,

    },
    xAxis: {
        min: startTime,
        scale: true,
        axisLabel: {
            formatter: function (val) {
                return Math.max(0, val - startTime) + ' 小时';
            }
        }
    },
    yAxis: {
        data: categories
    },
    series: [
        {
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
                opacity: 0.8
            },
            encode: {
                x: [1, 2],
                y: 0
            },
            label: '100',
            // data: data
        }
    ]
};

export interface IOptimizationResultChartProps {
    isDisplay: Readonly<boolean>,
    resultData: OptimizationResult,
};

const OptimizationResultChart: React.FC<IOptimizationResultChartProps> = ({ isDisplay, resultData }) => {
    let chartContainerRef = useRef<HTMLDivElement>(null);
    const [optionState, setOptionState] = useState(option);
    let chartsRef = useRef<EChartsReact>(null);

    useEffect(() => {
        if (chartContainerRef.current && isDisplay && chartsRef.current) {
            const categories = resultData.map(val => `${val[0][0]}->${val[0][1]}`);
            let colorIndex = 0;
            const data = resultData.map((resultPair, index) => {
                const result = resultPair[1];
                const res = [];
                for (const val of result) {
                    res.push({
                        name: 'test',
                        value: [index, val[0], val[0] + val[1], val[1]],
                        itemStyle: {
                            normal: {
                                color: colors[colorIndex],
                            }
                        },
                        userDefinedValue: val[2],
                    });
                    colorIndex = (colorIndex + 1) % colors.length;
                };
                return res;
            }).flat();

            dataCopy = _.clone(data);
            const copy = _.cloneDeep(optionState);

            // copy.grid.height = chartContainerRef.current.offsetHeight / categories.length;
            // copy.grid.height = 300;
            copy.series[0].data = data;
            copy.yAxis.data = categories;
            copy.xAxis.splitNumber = Math.max(...data.map(val => val.value[2]));
            if (_.isEqual(copy, optionState)) {
                const charts = chartsRef.current.getEchartsInstance();
                charts.setOption(copy);
            }
            setOptionState(copy);

            console.log({ copy, h: chartContainerRef.current.offsetHeight, categories, data });
        }
        else if (chartContainerRef.current && !isDisplay && chartsRef.current) {
            const charts = chartsRef.current.getEchartsInstance();
            charts.clear();
            console.log("clear charts");
        }
    }, [isDisplay]);

    // console.log({ optionState });
    return (
        <div ref={chartContainerRef} style={{ height: '100%', display: isDisplay ? 'block' : 'none' }} >
            <ReactECharts ref={chartsRef} option={optionState} style={{ height: '99%', marginTop: '1%' }} notMerge/>
        </div>
    );
};

export default OptimizationResultChart;

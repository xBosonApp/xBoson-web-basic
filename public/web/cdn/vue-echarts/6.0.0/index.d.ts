import { DefineComponent, PropType, Ref, ComputedRef, ComponentOptionsMixin, VNodeProps, AllowedComponentProps, ComponentCustomProps } from 'vue-demi';
import { ECBasicOption, EChartsType as EChartsType$1 } from 'echarts/types/dist/shared';
import { init } from 'echarts/core';

declare type InitType = typeof init;
declare type InitParameters = Parameters<InitType>;
declare type Theme = NonNullable<InitParameters[1]>;
declare type EChartsType = ReturnType<InitType>;
declare type SetOptionType = EChartsType["setOption"];
declare type Option = Parameters<SetOptionType>[0];
interface UpdateOptions {
    notMerge?: boolean;
    lazyUpdate?: boolean;
    silent?: boolean;
    replaceMerge?: any;
    transition?: any;
}

declare const LOADING_OPTIONS_KEY = "ecLoadingOptions";

declare const THEME_KEY = "ecTheme";
declare const INIT_OPTIONS_KEY = "ecInitOptions";
declare const UPDATE_OPTIONS_KEY = "ecUpdateOptions";

declare const _default: DefineComponent<{
    loading: BooleanConstructor;
    loadingOptions: ObjectConstructor;
    autoresize: BooleanConstructor;
    option: PropType<ECBasicOption>;
    theme: {
        type: PropType<Theme>;
    };
    initOptions: PropType<{
        renderer?: ("canvas" | "svg") | undefined;
        devicePixelRatio?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
        locale?: string | {
            time: {
                month: string[];
                monthAbbr: string[];
                dayOfWeek: string[];
                dayOfWeekAbbr: string[];
            };
            legend: {
                selector: {
                    all: string;
                    inverse: string;
                };
            };
            toolbox: {
                brush: {
                    title: {
                        rect: string;
                        polygon: string;
                        lineX: string;
                        lineY: string;
                        keep: string;
                        clear: string;
                    };
                };
                dataView: {
                    title: string;
                    lang: string[];
                };
                dataZoom: {
                    title: {
                        zoom: string;
                        back: string;
                    };
                };
                magicType: {
                    title: {
                        line: string;
                        bar: string;
                        stack: string;
                        tiled: string;
                    };
                };
                restore: {
                    title: string;
                };
                saveAsImage: {
                    title: string;
                    lang: string[];
                };
            };
            series: {
                typeNames: {
                    pie: string;
                    bar: string;
                    line: string;
                    scatter: string;
                    effectScatter: string;
                    radar: string;
                    tree: string;
                    treemap: string;
                    boxplot: string;
                    candlestick: string;
                    k: string;
                    heatmap: string;
                    map: string;
                    parallel: string;
                    lines: string;
                    graph: string;
                    sankey: string;
                    funnel: string;
                    gauge: string;
                    pictorialBar: string;
                    themeRiver: string;
                    sunburst: string;
                };
            };
            aria: {
                general: {
                    withTitle: string;
                    withoutTitle: string;
                };
                series: {
                    single: {
                        prefix: string;
                        withName: string;
                        withoutName: string;
                    };
                    multiple: {
                        prefix: string;
                        withName: string;
                        withoutName: string;
                        separator: {
                            middle: string;
                            end: string;
                        };
                    };
                };
                data: {
                    allData: string;
                    partialData: string;
                    withName: string;
                    withoutName: string;
                    separator: {
                        middle: string;
                        end: string;
                    };
                };
            };
        } | undefined;
    }>;
    updateOptions: PropType<UpdateOptions>;
    group: StringConstructor;
    manualUpdate: BooleanConstructor;
}, {
    dispatchAction: (...args: any[]) => void;
    getDataURL: (...args: any[]) => string;
    getConnectedDataURL: (...args: any[]) => string;
    getWidth: () => number;
    getHeight: () => number;
    getDom: () => HTMLElement;
    getOption: () => ECBasicOption;
    resize: (opts?: {
        width?: number | "auto" | undefined;
        height?: number | "auto" | undefined;
        silent?: boolean | undefined;
    } | undefined) => void;
    convertToPixel: {
        (finder: string | {
            [key: string]: unknown;
            seriesIndex?: (number | false | number[] | "all" | "none") | undefined;
            seriesId?: ((string | number) | (string | number)[]) | undefined;
            seriesName?: ((string | number) | (string | number)[]) | undefined;
            geoIndex?: (number | false | number[] | "all" | "none") | undefined;
            geoId?: ((string | number) | (string | number)[]) | undefined;
            geoName?: ((string | number) | (string | number)[]) | undefined;
            bmapIndex?: (number | false | number[] | "all" | "none") | undefined;
            bmapId?: ((string | number) | (string | number)[]) | undefined;
            bmapName?: ((string | number) | (string | number)[]) | undefined;
            xAxisIndex?: (number | false | number[] | "all" | "none") | undefined;
            xAxisId?: ((string | number) | (string | number)[]) | undefined;
            xAxisName?: ((string | number) | (string | number)[]) | undefined;
            yAxisIndex?: (number | false | number[] | "all" | "none") | undefined;
            yAxisId?: ((string | number) | (string | number)[]) | undefined;
            yAxisName?: ((string | number) | (string | number)[]) | undefined;
            gridIndex?: (number | false | number[] | "all" | "none") | undefined;
            gridId?: ((string | number) | (string | number)[]) | undefined;
            gridName?: ((string | number) | (string | number)[]) | undefined;
        }, value: Date | (string | number)): number;
        (finder: string | {
            [key: string]: unknown;
            seriesIndex?: (number | false | number[] | "all" | "none") | undefined;
            seriesId?: ((string | number) | (string | number)[]) | undefined;
            seriesName?: ((string | number) | (string | number)[]) | undefined;
            geoIndex?: (number | false | number[] | "all" | "none") | undefined;
            geoId?: ((string | number) | (string | number)[]) | undefined;
            geoName?: ((string | number) | (string | number)[]) | undefined;
            bmapIndex?: (number | false | number[] | "all" | "none") | undefined;
            bmapId?: ((string | number) | (string | number)[]) | undefined;
            bmapName?: ((string | number) | (string | number)[]) | undefined;
            xAxisIndex?: (number | false | number[] | "all" | "none") | undefined;
            xAxisId?: ((string | number) | (string | number)[]) | undefined;
            xAxisName?: ((string | number) | (string | number)[]) | undefined;
            yAxisIndex?: (number | false | number[] | "all" | "none") | undefined;
            yAxisId?: ((string | number) | (string | number)[]) | undefined;
            yAxisName?: ((string | number) | (string | number)[]) | undefined;
            gridIndex?: (number | false | number[] | "all" | "none") | undefined;
            gridId?: ((string | number) | (string | number)[]) | undefined;
            gridName?: ((string | number) | (string | number)[]) | undefined;
        }, value: (Date | (string | number))[]): number[];
    };
    convertFromPixel: {
        (finder: string | {
            [key: string]: unknown;
            seriesIndex?: (number | false | number[] | "all" | "none") | undefined;
            seriesId?: ((string | number) | (string | number)[]) | undefined;
            seriesName?: ((string | number) | (string | number)[]) | undefined;
            geoIndex?: (number | false | number[] | "all" | "none") | undefined;
            geoId?: ((string | number) | (string | number)[]) | undefined;
            geoName?: ((string | number) | (string | number)[]) | undefined;
            bmapIndex?: (number | false | number[] | "all" | "none") | undefined;
            bmapId?: ((string | number) | (string | number)[]) | undefined;
            bmapName?: ((string | number) | (string | number)[]) | undefined;
            xAxisIndex?: (number | false | number[] | "all" | "none") | undefined;
            xAxisId?: ((string | number) | (string | number)[]) | undefined;
            xAxisName?: ((string | number) | (string | number)[]) | undefined;
            yAxisIndex?: (number | false | number[] | "all" | "none") | undefined;
            yAxisId?: ((string | number) | (string | number)[]) | undefined;
            yAxisName?: ((string | number) | (string | number)[]) | undefined;
            gridIndex?: (number | false | number[] | "all" | "none") | undefined;
            gridId?: ((string | number) | (string | number)[]) | undefined;
            gridName?: ((string | number) | (string | number)[]) | undefined;
        }, value: number): number;
        (finder: string | {
            [key: string]: unknown;
            seriesIndex?: (number | false | number[] | "all" | "none") | undefined;
            seriesId?: ((string | number) | (string | number)[]) | undefined;
            seriesName?: ((string | number) | (string | number)[]) | undefined;
            geoIndex?: (number | false | number[] | "all" | "none") | undefined;
            geoId?: ((string | number) | (string | number)[]) | undefined;
            geoName?: ((string | number) | (string | number)[]) | undefined;
            bmapIndex?: (number | false | number[] | "all" | "none") | undefined;
            bmapId?: ((string | number) | (string | number)[]) | undefined;
            bmapName?: ((string | number) | (string | number)[]) | undefined;
            xAxisIndex?: (number | false | number[] | "all" | "none") | undefined;
            xAxisId?: ((string | number) | (string | number)[]) | undefined;
            xAxisName?: ((string | number) | (string | number)[]) | undefined;
            yAxisIndex?: (number | false | number[] | "all" | "none") | undefined;
            yAxisId?: ((string | number) | (string | number)[]) | undefined;
            yAxisName?: ((string | number) | (string | number)[]) | undefined;
            gridIndex?: (number | false | number[] | "all" | "none") | undefined;
            gridId?: ((string | number) | (string | number)[]) | undefined;
            gridName?: ((string | number) | (string | number)[]) | undefined;
        }, value: number[]): number[];
    };
    containPixel: (finder: string | {
        [key: string]: unknown;
        seriesIndex?: (number | false | number[] | "all" | "none") | undefined;
        seriesId?: ((string | number) | (string | number)[]) | undefined;
        seriesName?: ((string | number) | (string | number)[]) | undefined;
        geoIndex?: (number | false | number[] | "all" | "none") | undefined;
        geoId?: ((string | number) | (string | number)[]) | undefined;
        geoName?: ((string | number) | (string | number)[]) | undefined;
        bmapIndex?: (number | false | number[] | "all" | "none") | undefined;
        bmapId?: ((string | number) | (string | number)[]) | undefined;
        bmapName?: ((string | number) | (string | number)[]) | undefined;
        xAxisIndex?: (number | false | number[] | "all" | "none") | undefined;
        xAxisId?: ((string | number) | (string | number)[]) | undefined;
        xAxisName?: ((string | number) | (string | number)[]) | undefined;
        yAxisIndex?: (number | false | number[] | "all" | "none") | undefined;
        yAxisId?: ((string | number) | (string | number)[]) | undefined;
        yAxisName?: ((string | number) | (string | number)[]) | undefined;
        gridIndex?: (number | false | number[] | "all" | "none") | undefined;
        gridId?: ((string | number) | (string | number)[]) | undefined;
        gridName?: ((string | number) | (string | number)[]) | undefined;
    }, value: number[]) => boolean;
    appendData: (params: {
        seriesIndex: number;
        data: any;
    }) => void;
    clear: () => void;
    isDisposed: () => boolean;
    dispose: () => void;
    chart: Ref<EChartsType$1 | undefined>;
    root: Ref<HTMLElement | undefined>;
    setOption: (option: Option, updateOptions?: UpdateOptions | undefined) => void;
    nonEventAttrs: ComputedRef<{
        [key: string]: any;
    }>;
}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, Record<string, any>, string, VNodeProps & AllowedComponentProps & ComponentCustomProps, Readonly<{
    loading: boolean;
    autoresize: boolean;
    manualUpdate: boolean;
} & {
    loadingOptions?: Record<string, any> | undefined;
    option?: ECBasicOption | undefined;
    theme?: Theme | undefined;
    initOptions?: {
        renderer?: ("canvas" | "svg") | undefined;
        devicePixelRatio?: number | undefined;
        width?: number | undefined;
        height?: number | undefined;
        locale?: string | {
            time: {
                month: string[];
                monthAbbr: string[];
                dayOfWeek: string[];
                dayOfWeekAbbr: string[];
            };
            legend: {
                selector: {
                    all: string;
                    inverse: string;
                };
            };
            toolbox: {
                brush: {
                    title: {
                        rect: string;
                        polygon: string;
                        lineX: string;
                        lineY: string;
                        keep: string;
                        clear: string;
                    };
                };
                dataView: {
                    title: string;
                    lang: string[];
                };
                dataZoom: {
                    title: {
                        zoom: string;
                        back: string;
                    };
                };
                magicType: {
                    title: {
                        line: string;
                        bar: string;
                        stack: string;
                        tiled: string;
                    };
                };
                restore: {
                    title: string;
                };
                saveAsImage: {
                    title: string;
                    lang: string[];
                };
            };
            series: {
                typeNames: {
                    pie: string;
                    bar: string;
                    line: string;
                    scatter: string;
                    effectScatter: string;
                    radar: string;
                    tree: string;
                    treemap: string;
                    boxplot: string;
                    candlestick: string;
                    k: string;
                    heatmap: string;
                    map: string;
                    parallel: string;
                    lines: string;
                    graph: string;
                    sankey: string;
                    funnel: string;
                    gauge: string;
                    pictorialBar: string;
                    themeRiver: string;
                    sunburst: string;
                };
            };
            aria: {
                general: {
                    withTitle: string;
                    withoutTitle: string;
                };
                series: {
                    single: {
                        prefix: string;
                        withName: string;
                        withoutName: string;
                    };
                    multiple: {
                        prefix: string;
                        withName: string;
                        withoutName: string;
                        separator: {
                            middle: string;
                            end: string;
                        };
                    };
                };
                data: {
                    allData: string;
                    partialData: string;
                    withName: string;
                    withoutName: string;
                    separator: {
                        middle: string;
                        end: string;
                    };
                };
            };
        } | undefined;
    } | undefined;
    updateOptions?: UpdateOptions | undefined;
    group?: string | undefined;
}>, {
    loading: boolean;
    autoresize: boolean;
    manualUpdate: boolean;
}>;

export default _default;
export { INIT_OPTIONS_KEY, LOADING_OPTIONS_KEY, THEME_KEY, UPDATE_OPTIONS_KEY };

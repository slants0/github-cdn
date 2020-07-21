export default function resolveRef(args: any): Promise<{
    type: string;
    ref: any;
} | {
    type: string;
    ref?: undefined;
}>;

export class ThousandBitSeprator {
    static transform(num: number) {
        return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }
}
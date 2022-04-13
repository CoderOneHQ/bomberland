export class IdCounter {
    private id = 1;
    public get NextId() {
        return IdCounter.integerToId(this.id++);
    }

    // https://www.geeksforgeeks.org/find-excel-column-name-given-number/
    private static integerToId = (n: number) => {
        let tmp = [];
        let i = 0;

        while (n) {
            tmp[i] = n % 26;
            n = Math.floor(n / 26);
            i++;
        }

        for (let j = 0; j < i - 1; j++) {
            if (tmp[j] <= 0) {
                tmp[j] += 26;
                tmp[j + 1] = tmp[j + 1] - 1;
            }
        }
        let result = "";
        for (let j = i; j >= 0; j--) {
            if (tmp[j] > 0) result += String.fromCharCode(65 + tmp[j] - 1);
        }
        return result.toLowerCase();
    };
}

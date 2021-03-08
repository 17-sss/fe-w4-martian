class MyPromise {
    constructor(cbFunc) {
        // pending(대기) fulfilled(성공), rejected(실패), settled(결론은 남)
        this.status = 'pending';
        
        this.cbList = [];
        this.error = () => {throw new Error('MyPromise Error')};

        setTimeout(() => {
            try {
                this.status = 'fulfilled';
                cbFunc(this.pipe(...this.cbList), this.error);
            } catch (error) {
                this.status = 'rejected';
                this.error(error);
            }
        }, 0);
    }    
    then(func) {
        this.cbList.push(func);
        this.status = 'fulfilled';
        return this;
    }
    
    catch(error) {
        this.error = error;
        this.status = 'rejected';
        return this;
    }

    pipe = (...fns) => (initValue) => fns.reduce((acc, fn) => fn(acc), initValue);
}

//MyPromise 를 사용하기
const p = new MyPromise((resolve, reject) => {
    setTimeout(() => resolve('completed'), 1000);
});

p.then((res) => console.log(res, 1)).catch(() => console.log('에러'));

// 어찌저찌 해결하였지만 이해가 명확히 안됨. 계속 공부 필요

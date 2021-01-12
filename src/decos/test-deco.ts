export function TestDeco(arg: {surname?: string, type?: string, count?: number}) {
    return <T extends {new(...args:any[]):{}}>(constructor:T) => {
        return class extends constructor {
            surname = arg.surname;
            type = arg.type;
            count = arg.count;
        }
    }
}

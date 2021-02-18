abstract class ValueObject<T> {
    protected readonly props: T;

    public constructor (props: T) {
        this.props = props;
        // I had considered using Object.freeze(props) to prevent creator of this object modify the incoming argument later on.
        // However, Object.freeze() only do shallow freeze, so it's not fully safe. Instead, we should force type T to have only readonly members.
        // Also, using interface with merely readonly member will have no performance impact compare to Object.freeze().
        // Please enforce this rule in code review process.
    }

    // ValueObjects are objects that we determine their equality through their structrual property.
    // Structural equality means that two objects have the same content.
    // This is different from referential equality / identity which means that the two objects are the same.
    public Equals (other: ValueObject<T>): boolean {
        if (typeof other === 'undefined') return false;
        return JSON.stringify(this.props) === JSON.stringify(other.props);
    }
}

export {
    ValueObject,
};

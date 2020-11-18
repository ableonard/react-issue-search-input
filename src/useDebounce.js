import { useEffect, useState } from "react";

const useDebounce = (value, debounceTimeInMillis) => {
    const [ debouncedValue, setDebouncedValue ] = useState(value);

    useEffect(() =>{
        const timer = setTimeout(() => setDebouncedValue(value), debounceTimeInMillis);

        return () => clearTimeout(timer);
    }, [value, debounceTimeInMillis]);

    return debouncedValue;
};

export default useDebounce;

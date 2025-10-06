import { useState } from 'react';
/**
    Lưu trữ và truy xuất giá trị từ LocalStorage, đồng thời 
    cung cấp một interface giống như useState để quản lý nó.
 */
function useLocalStorage<T>(key: string, initialValue: T) {
    // Lấy giá trị ban đầu từ LocalStorage hoặc dùng giá trị mặc định
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Hàm setter mới ghi vào cả state và LocalStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Cho phép truyền vào function giống như useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue] as const; // 'as const' để đảm bảo type an toàn
}

export default useLocalStorage;
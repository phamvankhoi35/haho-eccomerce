import { useEffect, useState } from "react";

// Định nghĩa trạng thái cho hook
interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

function useFetch<T>(url: string, options?: RequestInit): FetchState<T> {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        // Biến cờ để ngăn chặn cập nhật state khi component đã unmount
        let isMounted = true;

        const fetchData = async () => {
            // Bắt đầu tải, đặt loading = true
            setState((s) => ({ ...s, loading: true, error: null }));

            try {
                const response = await fetch(url, options);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json: T = await response.json();

                // Chỉ cập nhật state nếu component vẫn còn mount
                if (isMounted) {
                    setState({
                        data: json,
                        loading: false,
                        error: null,
                    });
                }
            } catch (e) {
                const error = e instanceof Error ? e : new Error('An unknown error occurred');

                // Cập nhật lỗi nếu component vẫn còn mount
                if (isMounted) {
                    setState({
                        data: null,
                        loading: false,
                        error: error,
                    });
                }
            }
        };

        fetchData();

        // Cleanup function: Đặt cờ thành false khi component unmount
        return () => {
            isMounted = false;
        };
    }, [url, JSON.stringify(options)]); // Dependency Array: Chạy lại khi URL hoặc Options thay đổi

    return state;
}

export default useFetch;
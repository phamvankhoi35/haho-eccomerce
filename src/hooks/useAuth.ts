import { useAppSelector } from "../app/hooks";

export const useAuth = () => {
    const { user, accessToken, isAuthenticated, loading, error } = useAppSelector(
        (state) => state.auth
    );

    return {
        user,
        accessToken,
        isAuthenticated,
        loading,
        error,
        roles: user?.roles || [],
    };
};
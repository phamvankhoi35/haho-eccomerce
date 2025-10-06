const Forbidden = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-[80vh] text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-2">403 - Access Denied</h1>
                <p className="text-gray-600">You do not have permission to access this page.</p>
            </div>
        </>
    )
}

export default Forbidden

export default function authLayout ({
    children
} : {
    children: React.ReactNode
}) {
    return (
        <div className="flex justify-center items-center h-[100vh]">
            {children}
        </div>
    )
}
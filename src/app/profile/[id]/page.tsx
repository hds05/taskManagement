export default function UserProfile({params}: any) {
    return(
        <div className='p-3 text-center flex items-center justify-center h-screen' >
            <div className="bg-gray-100 p-5 text-black rounded-lg shadow-lg flex flex-col items-center justify-center gap-5">
                <h1 className="text-[30px] text-gray-700 font-black mb-10">Profile</h1>
                <p className="text-sm text-gray-800 mt-3">
                    This is the profile page of <span className="p-2 bg-amber-500 text-white rounded-lg ml-2">{params.id}</span>.
                </p>
            </div>
        </div>
    )
}
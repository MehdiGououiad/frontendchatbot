const Popup = ({ message, visible }) => {
    if (!visible) return null;
  
    return (
        <div className={`fixed top-10 inset-x-0 flex items-center justify-center p-4`}>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Attention! </strong>
                <span className="block sm:inline">{message}</span>
                
            </div>
        </div>
    );
  };
export default Popup;
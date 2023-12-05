function Header() {
  return (
    <div className="flex">
      <div className="flex items-center  border-b border-r border-gray-300 w-[75%]">
        <h1 className="text-black text-xl leading-6 font-bold ml-8 ">
          BMCI GROUPE BNP PARIBAS
        </h1>
        <h2 className="text-zinc-600 text-xl leading-6 ml-5">
          La banque d&apos;un monde qui change
        </h2>
      </div>
      <div className="flex   w-[25%] justify-end   mt-2 border-b border-gray-300 pb-2">
        <div className="mr-5">
          <h2 className="font-bold">Anouar Alaoui</h2>
          <h2 className="text-zinc-600 leading-6">Chargé Clientèle</h2>
        </div>
        <img src="photo.svg" alt="" className="mr-8 mb-2" />
      </div>
    </div>
  );
}

export default Header;

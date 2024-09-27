import React, { useState } from 'react';
import headerMenu from './headerMenu';

function GlobalNav({ className, setPage }) {
  const [showMenu, setShowMenu] = useState(false);

  const list = headerMenu.map(item => {
    return (
      <li className="global-nav-item" key={item.name}>
        <a
          className="global-nav-link"
          href={item.path}
          onClick={(e) => {
            e.preventDefault();
            setPage(item.name);
          }}
        >
          {item.name}
        </a>
      </li>
    );
  });

  const menuClass = showMenu ? 'global-nav-list--open' : '';
  return (
    <nav className={`global-nav ${className}`}>
      <button
        className="global-nav-button"
        onClick={() => {
          setShowMenu(!showMenu);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={`global-nav-list ${menuClass}`}>
        {list}
      </ul>
    </nav>
  );
}

export default GlobalNav;




// import React, { useState } from 'react';
// import headerMenu from './headerMenu';

// function GlobalNav({ className, setPage }) {
//   const [showMenu, setShowMenu] = useState(false);
//   const [showSubMenu, setShowSubMenu] = useState(false);
//   const [showModal, setShowModal] = useState(false); // add state for modal

//   const handleVehicleClick = (e) => {
//     e.preventDefault();
//     setPage("Vehicle");
//     setShowSubMenu(!showSubMenu);
//   };

//   const handleModalClick = (e) => {
//     e.preventDefault();
//     setShowModal(true);
//   };

//   const list = headerMenu.map((item) => {
//     if (item.name === "Vehicle") {
//       return (
//         <li
//           className="global-nav-item"
//           key={item.name}
//           onMouseEnter={() => setShowSubMenu(true)}
//           onMouseLeave={() => setShowSubMenu(false)}
//         >
//           <a className="global-nav-link" href={item.path} onClick={handleVehicleClick}>
//             {item.name}
//           </a>
//           {showSubMenu && (
//             <ul className="sub-menu">
//               {item.submenu.map((subitem) => (
//                 <li key={subitem.name}>
//                   <a href={subitem.path}>{subitem.name}</a>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </li>
//       );
//     } else if (item.name === "My Account") { // add "My Account" button
//       return (
//         <li className="global-nav-item" key={item.name}>
//           <button
//             className="global-nav-link"
//             onClick={handleModalClick}
//           >
//             {item.name}
//           </button>
//         </li>
//       );
//     } else {
//       return (
//         <li className="global-nav-item" key={item.name}>
//           <a
//             className="global-nav-link"
//             href={item.path}
//             onClick={(e) => {
//               e.preventDefault();
//               setPage(item.name);
//             }}
//           >
//             {item.name}
//           </a>
//         </li>
//       );
//     }
//   });

//   const menuClass = showMenu ? 'global-nav-list--open' : '';
//   return (
//     <nav className={`global-nav ${className}`}>
//       <button
//         className="global-nav-button"
//         onClick={() => {
//           setShowMenu(!showMenu);
//         }}
//       >
//         Menu
//       </button>
//       <ul className={`global-nav-list ${menuClass}`}>
//         {list}
//       </ul>
//       {showModal && ( // render modal if showModal is true
//         <div className="modal">
//           <button onClick={() => setShowModal(false)}>Close Modal</button>
//           <p>My Account modal content goes here.</p>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default GlobalNav;




// import React, { useState } from 'react';
// import headerMenu from './headerMenu';

//     function GlobalNav({ className, setPage }) {
//     const [showMenu, setShowMenu] = useState(false);

//     const list = headerMenu.map(item => {
//         return (
//             <li className="global-nav-item" key={item.name}>
//                 <a 
//                 className="global-nav-link" 
//                 href={item.path}
//                 onClick={(e)=>{
//                     e.preventDefault();
//                     setPage(item.name);
//                     }}
//                 >
//                     {item.name}
//                 </a>
//             </li>
//         );
//     });

//     const menuClass = showMenu ? 'global-nav-list--open' : '';
//     return (
//         <nav className={`global-nav ${className}`}>
//             <button className='global-nav-button'
//                 onClick={() => {
//                     setShowMenu(!showMenu);
//                 }}
//             >
//                 Menu
//                 {/* {showMenu ? "Close Menu" : "Open Menu"} */}
//             </button>
//             <ul className={`global-nav-list ${menuClass}`}>
//                 {list}
//             </ul>
//         </nav>
//     );
// }

// export default GlobalNav;
import React, { useState } from 'react';

function SidebarLinkGroup({
  children,
  activecondition,
}) {

  const [open, setOpen] = useState(activecondition);

  const handleClick = () => {
    setOpen(!open);
  }

  return (
    <li className={`px-0 py-1 rounded-sm mb-0.5 last:mb-0 ${activecondition && ''} `}>
      {children(handleClick, open)}
    </li>
  );
}

export default SidebarLinkGroup;
import React, { useEffect, useRef } from "react";
import RBSheet from "react-native-raw-bottom-sheet";

export default function PopupSheet({ children, open, setOpen, ...props }) {
  const { height = 200 } = props;
  const refRBSheet = useRef();

  const handleClose = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (open) refRBSheet.current.open();
  }, [open]);
  return (
    <RBSheet
      ref={refRBSheet}
      onClose={handleClose}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={height}
      closeOnPressBack={true}
      animationType="slide"
      customStyles={{
        wrapper: {
          backgroundColor: "transparent",
        },
        draggableIcon: {
          backgroundColor: "#000",
        },
      }}
    >
      {children}
    </RBSheet>
  );
}

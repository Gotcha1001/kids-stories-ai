import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@nextui-org/modal";
import Image from "next/image";

function CustomLoader({ isLoading }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

  return (
    <div>
      {isLoading && (
        <Modal
          isDismissable={false}
          isKeyboardDismissDisabled={true}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalBody className="p-10 flex w-full items-center justify-center gradient-background7">
                  <Image
                    src={"/loader.gif"}
                    alt="loader"
                    width={300}
                    height={300}
                    className="w=[200px] h-[200px] rounded-lg"
                  />
                  <h2 className="font-bold text-2xl text-primary gradient-title text-center">
                    Please Wait... Generating...
                  </h2>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}

export default CustomLoader;

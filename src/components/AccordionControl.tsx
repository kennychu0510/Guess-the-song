import { Accordion, ActionIcon, AccordionControlProps, Center } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

interface Props extends AccordionControlProps {
  onClick: () => void;
}

function CustomAccordionControl(props: Props) {
  const { onClick, ...restProps } = props;
  return (
    <Center>
      <Accordion.Control {...restProps} />
      <ActionIcon size="lg" variant="subtle" color="gray">
        <IconTrash color='red' size="1rem" onClick={onClick}/>
      </ActionIcon>
    </Center>
  );
}

export default CustomAccordionControl
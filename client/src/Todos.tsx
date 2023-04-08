import {
  For,
  Show,
  createResource,
  createSignal,
  children,
  JSX,
  Accessor,
} from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import http from "./services/http";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  Textarea,
  createDisclosure,
  notificationService,
} from "@hope-ui/solid";
import { FaSolidPlus, FaSolidTrash, FaSolidXmark } from "solid-icons/fa";
import { FiSearch } from "solid-icons/fi";
import { Todo } from "./types/api/Todo";
import createMutation from "./utils/createMutation";

const initialTodo: Todo = {
  id: "",
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  title: "",
  notes: "",
};

const Todos = () => {
  const formModal = createDisclosure();
  const [form, setForm] = createStore<Todo>({ ...initialTodo });
  const [search, setSearch] = createSignal("");

  const onError = (err: Error) => {
    console.log("Error!", err);
    notificationService.show({
      status: "danger",
      title: "Error!",
      description: err.message,
    });
  };

  const [todos, { refetch }] = createResource<Todo[]>(() => http("/todos/"));
  const submitMutation = createMutation(
    async (data: Todo) => {
      return http(`/todos/${data.id}`, data.id !== "" ? "PUT" : "POST", data);
    },
    {
      onSuccess: (_, { id }) => {
        refetch();
        formModal.onClose();
        notificationService.show({
          status: "success",
          title: `Todo ${id !== "" ? "updated" : "added"}!`,
        });
      },
      onError,
    }
  );
  const deleteMutation = createMutation(
    async (id: string) => http(`/todos/${id}`, "DELETE"),
    {
      onSuccess: () => {
        refetch();
        formModal.onClose();
        notificationService.show({
          status: "success",
          title: `Todo removed!`,
        });
      },
      onError,
    }
  );

  const todoList = () => {
    let items = todos();

    if (search().length > 0) {
      const keyword = search().toLowerCase();
      items = items?.filter(
        (i) =>
          i.title.toLowerCase().includes(keyword) ||
          i.notes.toLowerCase().includes(keyword)
      );
    }

    return items;
  };

  return (
    <main>
      <Box bgColor="$blackAlpha12" shadow="$lg" px="$8" py="$5">
        <Heading fontSize="$xl" textAlign="center">
          My Todos App
        </Heading>
      </Box>

      <Container p={{ "@initial": "$4", "@md": "$8" }}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} />
          </InputLeftElement>
          <Input
            placeholder="Search..."
            value={search()}
            onChange={(e) => setSearch(e.currentTarget.value)}
            onKeyUp={(e) => setSearch(e.currentTarget.value)}
          />
          <Show when={search() !== ""}>
            <InputRightElement>
              <IconButton
                aria-label="clear"
                icon={<Icon as={FaSolidXmark} />}
                onClick={() => setSearch("")}
                variant="ghost"
              />
            </InputRightElement>
          </Show>
        </InputGroup>

        <SimpleGrid
          mt="$8"
          columns={{ "@initial": 1, "@md": 2, "@lg": 3 }}
          gap="$5"
        >
          <TodoItemCard
            onClick={() => {
              formModal.onOpen();
              setForm({ ...initialTodo });
            }}
          >
            <Icon as={FaSolidPlus} fontSize="$2xl" />
          </TodoItemCard>

          <For each={todoList()}>
            {(item) => (
              <TodoItem
                item={item}
                onClick={() => {
                  formModal.onOpen();
                  setForm({ ...item });
                }}
              />
            )}
          </For>
        </SimpleGrid>
      </Container>

      <FormModal
        disclosure={formModal}
        data={form}
        setData={setForm}
        onDelete={() => deleteMutation.mutate(form.id)}
        onSubmit={() => submitMutation.mutate(form)}
        isLoading={submitMutation.isLoading}
      />
    </main>
  );
};

type TodoItemCardProps = {
  onClick: () => void;
  children?: JSX.Element;
};

const TodoItemCard = ({ onClick, ...props }: TodoItemCardProps) => {
  const body = children(() => props.children);

  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      bgColor="$blackAlpha10"
      rounded="$md"
      p="$5"
      shadow="$md"
      color="white"
      cursor="pointer"
      minHeight={160}
      _hover={{ bgColor: "$blackAlpha12" }}
    >
      {body()}
    </Box>
  );
};

type TodoItemProps = TodoItemCardProps & {
  item: Todo;
};

const TodoItem = ({ item, onClick }: TodoItemProps) => (
  <TodoItemCard onClick={onClick}>
    <Heading as="p" fontSize="$xl" fontWeight="normal" textAlign="left">
      {item.title}
    </Heading>
    <Show when={item.notes.length > 0}>
      <Text textAlign="left" mt="$3" noOfLines={2} lineHeight={1.8}>
        <div innerHTML={item.notes.split("\n").join("<br />")} />
      </Text>
    </Show>
  </TodoItemCard>
);

type FormModalProps = {
  disclosure: ReturnType<typeof createDisclosure>;
  data: Todo;
  setData: SetStoreFunction<Todo>;
  onDelete?: () => void;
  onSubmit?: () => void;
  isLoading: Accessor<boolean>;
};

const FormModal = ({
  disclosure,
  data,
  setData,
  onDelete,
  onSubmit,
  isLoading,
}: FormModalProps) => {
  const { isOpen, onClose } = disclosure;

  return (
    <Modal centered opened={isOpen()} onClose={onClose} initialFocus="#title">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          {`${data.id !== "" ? "Update" : "Create"} Todo`}
        </ModalHeader>
        <ModalBody>
          <FormControl id="title" mb="$4">
            <FormLabel>Title</FormLabel>
            <Input
              placeholder="Title"
              value={data.title}
              onChange={(e) => setData({ title: e.target.value })}
            />
          </FormControl>
          <FormControl id="notes">
            <FormLabel>Notes</FormLabel>
            <Textarea
              placeholder="..."
              value={data.notes}
              onChange={(e) => setData({ notes: e.target.value })}
              rows={10}
              minWidth="$full"
              maxWidth="$full"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <HStack spacing="$3" width="$full">
            <Show when={data.id !== ""}>
              <IconButton
                aria-label="delete"
                icon={<Icon as={FaSolidTrash} />}
                variant="outline"
                onClick={onDelete}
              />
            </Show>
            <Box flex={1} />
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button loading={isLoading()} onClick={onSubmit} px="$8">
              Save
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Todos;

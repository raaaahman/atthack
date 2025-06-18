import { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta = {
  title: "Component/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    characterId: "thisCharacterDoesNotExists",
  },
};

export const Pulse: Story = {
  args: {
    characterId: "pulse",
  },
  parameters: {
    variables: new Map([["pulse_avatar", "Pulse.png"]]),
  },
};

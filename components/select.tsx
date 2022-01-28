import { Select } from "antd";
import type { FC, Dispatch, SetStateAction } from "react";

interface Properties {
  onChange: Dispatch<SetStateAction<string>>;
}

const CustomSelect: FC<Properties> = ({ children, onChange }) => {
  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Search to Select"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toString().toLowerCase().includes(input.toLowerCase())
      }
      filterSort={(optionA, optionB) =>
        optionA.children
          .toString()
          .toLowerCase()
          .localeCompare(optionB.children.toString().toLowerCase())
      }
      onChange={onChange}
    >
      {children}
    </Select>
  );
};

export default CustomSelect;

export const { Option: SelectOption } = Select;

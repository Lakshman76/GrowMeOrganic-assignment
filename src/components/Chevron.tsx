import React, { useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";

interface ChevronProps {
  onSelectRows: (rows: number) => void;
}

const Chevron: React.FC<ChevronProps> = ({ onSelectRows }) => {
  const op = useRef<OverlayPanel>(null);
  const [value, setValue] = useState<number | undefined>(undefined);

  const handleSelect = () => {
    if (value) {
      onSelectRows(value); // Pass the value to Paginator to select rows
    }
    op.current?.hide(); // Hide the overlay after selection
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button
        type="button"
        icon="pi pi-chevron-down"
        className="p-button-text p-button-sm"
        onClick={(e) => op.current && op.current.toggle(e)}
      />

      <OverlayPanel ref={op}>
        <div style={{ width: "200px", height: "100px" }}>
          <InputText
            value={value === undefined ? "" : value.toString()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(parseInt(e.target.value, 10))
            }
            placeholder="No. of rows to select"
            type="number"
            style={{ width: "100%" }}
          />
          <Button
            label="Select"
            style={{ marginTop: "10px", width: "100%" }}
            onClick={handleSelect}
          />
        </div>
      </OverlayPanel>
      <span>Title</span>
    </div>
  );
};

export default Chevron;

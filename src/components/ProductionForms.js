import { React, useEffect } from "react";
import { PrimaryButton, TextField } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { createBatch, doneCheckMaterials } from "../features/batch/batchSlice";
import { createNotification } from "../features/notification/notificationSlice";
import {
  checkMaterialsAvailability,
  getMaterials,
} from "../features/inventory/inventorySlice";

import { useState } from "react";

export const PreProductionForm = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [created, setCreated] = useState(false);
  const [checkAvailability, setCheckAvailability] = useState(false);

  const { materials, availability } = useSelector((state) => state.inventory);
  const { isError, isLoading, message, checkMaterials } = useSelector(
    (state) => state.batch
  );

  useEffect(() => {
    dispatch(getMaterials());
  }, []);

  useEffect(() => {
    if (isError && !isLoading) {
      alert(message.response);
    }
  }, [isLoading, isError, message]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = () => {
    if (user.role === "owner") {
      dispatch(
        createBatch({
          materials: Object.keys(formData).map((materialInput) => {
            return {
              material: materials.find((materialItem) => {
                return materialItem.name === materialInput;
              })._id,
              weight: formData[materialInput],
            };
          }),
        })
      );
      setCreated(true);
    } else {
      alert("Restricted to Owner Only");
    }
  };

  useEffect(() => {
    if (checkMaterials) {
      console.log("fetch materials");

      dispatch(getMaterials());
    }
  }, [checkMaterials]);

  useEffect(() => {
    if (checkMaterials) {
      console.log("check materials");
      dispatch(checkMaterialsAvailability());
      dispatch(doneCheckMaterials());
      setCheckAvailability(true);
    }
  }, [materials]);

  useEffect(() => {
    if (checkAvailability) {
      if (availability.critical.length) {
        dispatch(
          createNotification({
            title: "Material Low on Quantity",
            message: `${availability.critical.join(
              ", "
            )} have low quantity, purchase more soon to replenish`,
          })
        );
      }
      if (availability.empty.length) {
        dispatch(
          createNotification({
            title: "Material Empty",
            message: `Empty quantity on ${availability.empty.join(
              ", "
            )}, purchase more soon to replenish`,
          })
        );
      }

      setCheckAvailability(false);
    }
  }, [checkAvailability]);

  return (
    <div>
      <h3 className="poppins-heading-6">Pre-Production</h3>
      <form className="flex flex-col mt-8">
        {materials.map((material) => {
          return (
            <div
              className="flex flex-col items-start w-full md:flex-row md:space-x-4 md:items-center"
              key={material.name}
            >
              <p className="w-full font-semibold open-paragraph md:w-1/3">
                {material.name} ({material.unit})
              </p>
              <TextField
                value={formData[material.id]}
                type="number"
                name={material.name}
                id="dayami-kg"
                placeholder="0"
                className="w-full md:w-2/3"
                onChange={onChange}
              />
            </div>
          );
        })}
        <PrimaryButton
          disabled={Object.keys(formData).length === 0}
          className="mt-8"
          name="Start Production"
          onClick={onSubmit}
        >
          <input type="submit" value="Submit" />
        </PrimaryButton>
      </form>
    </div>
  );
};

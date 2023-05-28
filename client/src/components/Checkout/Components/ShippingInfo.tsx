import style from "../../../styles/style";
import { Country, State } from "country-state-city";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks";

type IProps = {
  toggleActiveStep: (para: number) => void;
};

export default function ShippingInfo({ toggleActiveStep }: IProps) {
  const [selectedAddress, setSelectedAddress] = useState<null | string>(null);

  const { user } = useAppSelector((state) => state.user);
  const { addresses } = user;

  const initialFormState = {
    fullName: "",
    email: "",
    primaryNumber: "",
    alternateNumber: "",
    zipCode: "",
    selectedCountry: "",
    selectedState: "",
    address1: "",
    address2: "",
    address3: "",
  };

  const [formState, setFormState] = useState(initialFormState);

  useEffect(() => {
    if (selectedAddress) {
      const address = addresses?.find(
        (address) => address._id === selectedAddress
      );

      if (address) {
        setFormState({
          fullName: user?.name,
          email: user?.email,
          primaryNumber: user?.primaryPhoneNumber,
          alternateNumber: user?.secondaryPhoneNumber,
          zipCode: address?.zipcode.toString(),
          selectedCountry: address?.country,
          selectedState: address?.state,
          address1: address?.address1,
          address2: address?.address2,
          address3: address?.address3,
        });
      }
    } else {
      setFormState(initialFormState);
    }
  }, [selectedAddress]);

  function handleFormInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  }

  function handleAddressChange(e: ChangeEvent<HTMLInputElement>) {
    setSelectedAddress(
      e.target.value === selectedAddress ? null : e.target.value
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    localStorage.setItem("shipping_address", JSON.stringify(formState));
    toggleActiveStep(1);
  }

  return (
    <div className="bg-white shadow rounded p-8">
      <h4 className="text-lg font-semibold text-gray-800">Shipping Address</h4>
      <div className="mt-8">
        <form className="space-y-6" aria-required onSubmit={handleSubmit}>
          <div className={`${style.flex_normal} gap-8 flex-wrap`}>
            <div className="w-2/5">
              <label className="mb-1 text-sm hidden md:block" htmlFor="name">
                Full Name:
              </label>
              <input
                type="text"
                className={`${style.input} w-full text-sm py-1.5 px-2`}
                placeholder="Enter full name"
                id="name"
                name="fullName"
                required
                value={formState.fullName}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="w-2/5">
              <label className="mb-1 text-sm hidden md:block" htmlFor="email">
                Email:
              </label>
              <input
                type="email"
                className={`${style.input} w-full text-sm py-1.5 px-2`}
                id="email"
                placeholder="Enter your email address"
                required
                name="email"
                value={formState.email}
                onChange={handleFormInputChange}
              />
            </div>
          </div>

          <div className={`${style.flex_normal} gap-8 flex-wrap`}>
            <div className="w-2/5">
              <label
                className="mb-1 text-sm hidden md:block"
                htmlFor="primary-number"
              >
                Primary Number:
              </label>
              <input
                type="number"
                className={`${style.input} w-full text-sm py-1.5 px-2`}
                placeholder="Enter primary number"
                id="primary-number"
                required
                name="primaryNumber"
                value={formState.primaryNumber}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="w-2/5">
              <label className="mb-1 text-sm hidden md:block" htmlFor="email">
                Alternate Number:
              </label>
              <input
                type="number"
                className={`${style.input} w-full text-sm py-1.5 px-2`}
                id="email"
                name="alternateNumber"
                placeholder="Enter alternate number"
                required
                value={formState.alternateNumber}
                onChange={handleFormInputChange}
              />
            </div>
          </div>

          <div className={`${style.flex_normal} gap-8 flex-wrap`}>
            <div className="w-2/5">
              <label className="mb-1 text-sm hidden md:block" htmlFor="zipCode">
                Zip Code:
              </label>
              <input
                type="number"
                className={`${style.input} w-full text-sm py-1.5 px-2`}
                placeholder="Enter zip code"
                id="zipCode"
                required
                name="zipCode"
                value={formState.zipCode}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="w-2/5">
              <label
                className="mb-1 text-sm hidden md:block"
                htmlFor="selectedCountry"
              >
                Select Country:
              </label>
              <select
                id="selectedCountry"
                name="selectedCountry"
                className="bg-gray-50 text-sm md:text-base px-3 py-1.5 border rounded"
                value={formState.selectedCountry}
                required
                onChange={handleFormInputChange}
              >
                <option selected disabled value="">
                  Choose Country
                </option>
                {Country.getAllCountries()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className={`${style.flex_normal} gap-8 flex-wrap`}>
            <div className="w-2/5">
              <label
                className="mb-1 text-sm hidden md:block"
                htmlFor="selectedState"
              >
                Select State:
              </label>
              <select
                id="selectedState"
                name="selectedState"
                value={formState.selectedState}
                required
                onChange={handleFormInputChange}
                className="bg-gray-50 text-sm md:text-base px-3 py-1.5 border rounded"
              >
                <option selected disabled value="">
                  Choose State
                </option>
                {State.getStatesOfCountry(formState.selectedCountry)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="w-2/5">
              <label
                className="mb-1 text-sm hidden md:block"
                htmlFor="address1"
              >
                Address 1:
              </label>
              <input
                type="text"
                name="address1"
                className={`${style.input} w-full text-sm py-1.5 px-2`}
                id="address1"
                placeholder="House No., Building Name (Required)*"
                required
                value={formState.address1}
                onChange={handleFormInputChange}
              />
            </div>
          </div>

          <div className={`${style.flex_normal} gap-8 flex-wrap`}>
            <div className="w-2/5">
              <label
                className="mb-1 text-sm hidden md:block"
                htmlFor="address2"
              >
                Address 2:
              </label>
              <input
                type="text"
                className={`${style.input} w-full text-sm py-1.5 px-2`}
                id="address2"
                name="address2"
                placeholder="Road Name, Area, Colony (Required)*"
                required
                value={formState.address2}
                onChange={handleFormInputChange}
              />
            </div>
            <div className="w-2/5">
              <label
                className="mb-1 text-sm hidden md:block"
                htmlFor="address3"
              >
                Address 3:
              </label>
              <input
                type="text"
                className={`${style.input} w-full text-sm py-1.5 px-2`}
                id="address3"
                name="address3"
                placeholder="Nearby Famous Shop/Mall/Landmark"
                value={formState.address3}
                onChange={handleFormInputChange}
              />
            </div>
          </div>

          {user && user.addresses?.length > 0 && (
            <div>
              <label htmlFor="savedAddresses" className="mb-2 block text-sm">
                Select From Saved Addresses:
              </label>
              <div className={`${style.flex_normal} gap-12`}>
                {addresses?.map((address) => (
                  <div key={address._id}>
                    <input
                      type="checkbox"
                      name="address"
                      id={address._id}
                      value={address._id}
                      checked={address._id == selectedAddress}
                      onChange={handleAddressChange}
                    />
                    <label className="ml-2 text-sm" htmlFor={address._id}>
                      {address.addressType}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              value="Pay Now"
              className="bg-[#28a745] text-white rounded py-1.5 px-4 hover:shadow transition-all hover:bg-green-600"
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

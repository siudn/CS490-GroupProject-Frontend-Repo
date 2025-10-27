import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  salonName: z.string().min(2, "Salon name is required"),
  ownerName: z.string().min(2, "Owner name is required"),
  email: z.string().email("Invalid email address"),
  licenseNumber: z.string().min(5, "License number required"),
});

export default function SalonApplicationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-purple-600 text-center">
        Salon Application Form
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Salon Name</label>
          <input
            {...register("salonName")}
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter salon name"
          />
          {errors.salonName && (
            <p className="text-red-500 text-sm">{errors.salonName.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Owner Name</label>
          <input
            {...register("ownerName")}
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter owner name"
          />
          {errors.ownerName && (
            <p className="text-red-500 text-sm">{errors.ownerName.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            {...register("email")}
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">License Number</label>
          <input
            {...register("licenseNumber")}
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter license number"
          />
          {errors.licenseNumber && (
            <p className="text-red-500 text-sm">
              {errors.licenseNumber.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { z } from "zod";
import { useStoreModal } from "@/hooks/use-store-modal";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axios from "axios";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nama Toko Tidak Boleh Kurang Dari 3 Huruf",
  }),
});

export const StoreModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const storeModal = useStoreModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/stores", values);
      toast.success("Berhasil Membuat Toko")
      window.location.assign(`/${res.data.id}`)
    } catch (err) {
      console.error(err);
      toast.error("Gagal Membuat Toko")
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      title="Buat Toko"
      description="Tambahkan Produk dan Kategori"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-2 py-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama Toko"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-x-2 flex justify-end items-center pt-4">
              <Button
                type="button"
                onClick={storeModal.onClose}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

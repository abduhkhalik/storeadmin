"use client";

import * as z from "zod";
import { useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Banner } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { UseOrigin } from "@/hooks/use-origin";

interface BannerFormProps {
  initialData: Banner | null;
}

const formSchema = z.object({
  label: z.string().min(1),
  imgUrl: z.string().min(1),
});

type BannerFormValues = z.infer<typeof formSchema>;

export const BannerForm: React.FC<BannerFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();
  const origin = UseOrigin();

  const [open, setOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const title = initialData ? "Edit Banner" : "Buat Banner";
  const description = initialData ? "Edit Banner Toko" : "Buat Banner Toko";
  const toastMessage = initialData
    ? "Banner berhasil di edit"
    : "Banner berhasil dibuat";
  const action = initialData ? "Simpan Banner" : "Buat Banner";

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imgUrl: "",
    },
  });

  const onSubmit = async (data: BannerFormValues) => {
    try {
      setisLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/banners/${params.bannerId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/banners`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/banners`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Cek kembali data yang diinput");
    } finally {
      setisLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setisLoading(true);
      await axios.delete(`/api/${params.storeId}/banners/${params.bannerId}`);
      router.refresh();
      router.push(`/${params.storeId}/banners`);
      toast.success("Banner berhasil dihapus");
    } catch (error) {
      toast.error("Cek kembali data dan koneksi mu");
    } finally {
      setisLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={isLoading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Label Banner"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      disable={isLoading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                      value={field.value ? [field.value] : []}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
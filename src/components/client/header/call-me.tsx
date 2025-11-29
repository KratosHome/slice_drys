"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ForwardedMaskedInput from "@/components/ui/forwarded-masked-input";
import { Button } from "@/components/ui/button";

import { type ChangeEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import { callMeBackServer } from "@/server/info/call-me-back.server";

interface IFormData {
  name: string;
  phoneNumber: string;
}

export default function CallMe() {
  const MASKED_INPUT_PREFIX = "+38 (0";
  const MASKED_INPUT_MASK = [
    "+",
    /\d/,
    /\d/,
    " ",
    "(",
    /\d/,
    /\d/,
    /\d/,
    ")",
    " ",
    /\d/,
    /\d/,
    /\d/,
    "-",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
  ];

  const t = useTranslations("main.call-me");

  const [isCallOpen, setIsCallOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IFormData>({
    defaultValues: {
      name: "",
      phoneNumber: MASKED_INPUT_PREFIX,
    },
  });

  const sendCall = async (data: IFormData): Promise<void> => {
    await callMeBackServer({
      name: data.name,
      phoneNumber: data.phoneNumber,
    });
    reset();
    setIsCallOpen(false);
  };

  return (
    <Dialog
      open={isCallOpen}
      onOpenChange={setIsCallOpen}
      aria-labelledby="call-me"
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="button"
          className="max-w-24 sm:max-w-fit"
        >
          {t("call-back")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("call-back")}</DialogTitle>
          <DialogDescription>
            {t("leave-your-details-and-we-will-call-you-back")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(sendCall)} className="grid gap-4 py-4">
          <div className="flex flex-col items-start">
            <Label htmlFor="name" className="text-right">
              {t("your-name")}
            </Label>
            <Input
              id="name"
              placeholder={t("enter-your-name")}
              {...register("name", { required: `${t("enter-name")}` })}
            />

            {errors.name ? (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            ) : null}
          </div>
          <div className="flex flex-col items-start">
            <Label htmlFor="phoneNumber" className="text-right">
              {t("phone-number")}
            </Label>
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                required: `${t("enter-phone-number")}`,
                validate: (value: string) =>
                  value && value.length === 18
                    ? true
                    : `${t("enter-full-phone-number")}`,
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => {
                const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                  let newVal = event.target.value;

                  if (!newVal.startsWith(MASKED_INPUT_PREFIX)) {
                    newVal = MASKED_INPUT_PREFIX;
                  }

                  onChange(newVal);
                };

                return (
                  <ForwardedMaskedInput
                    id="phoneNumber"
                    mask={MASKED_INPUT_MASK}
                    placeholder={MASKED_INPUT_PREFIX}
                    guide={false}
                    onBlur={onBlur}
                    onChange={handleChange}
                    value={value}
                    ref={ref}
                    className="placeholder:text-muted-foreground text-foreground border-input h-[48px] w-full rounded-[8px] border-[1px] bg-transparent px-[8px] py-[14px] text-[16px]"
                  />
                );
              }}
            />

            {errors.phoneNumber ? (
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" variant="button">
            {t("call-back")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

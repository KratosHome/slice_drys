'use client'
import React, { FC, useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/admin/ui/alert-dialog'
import { Button } from '@/components/admin/ui/button'
import { Label } from '@/components/admin/ui/label'
import { Input } from '@/components/admin/ui/input'
import { Textarea } from '@/components/admin/ui/textarea'
import { Checkbox } from '@/components/admin/ui/checkbox'
import { useFieldArray, useForm, Controller } from 'react-hook-form'
import { createProduct } from '@/server/products/create-product.server'
import { toast } from '@/hooks/use-toast'
import Loading from '@/components/admin/ui/loading'
import { editProduct } from '@/server/products/edit-product.server'
import { useRouter } from 'next/navigation'
import { convertToBase64 } from '@/utils/convertToBase64'
import Image from 'next/image'
import { deleteProduct } from '@/server/products/delete-product.server'
import CategoryTreeCheckbox from '@/components/admin/categories/category-tree-checkbox'

interface ICrateProduct {
  buttonTitle: string
  product?: IProductLocal
  recommendations: IRecommendations
  categories: ICategory[]
}

interface IResult {
  success: boolean
  message: string
}

const EditorProduct: FC<ICrateProduct> = ({
  buttonTitle,
  product,
  recommendations,
  categories,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<IProductLocal>({
    defaultValues: {
      name: { en: '', uk: '' },
      description: { en: '', uk: '' },
      categories: [],
      composition: { en: [], uk: [] },
      img: '',
      slug: '',
      statusLabel: [],
      variables: [
        {
          weight: 0,
          price: 0,
          newPrice: 0,
          currency: '',
          count: 0,
        },
      ],
      nutritionalValue: {
        proteins: '',
        fats: '',
        carbohydrates: '',
        energyValue: '',
      },
    },
  })
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [compositionInput, setCompositionInput] = useState({ en: '', uk: '' })
  const [composition, setComposition] = useState({
    en: product?.composition?.en || [],
    uk: product?.composition?.uk || [],
  })

  const {
    fields: variableFields,
    append: appendVariable,
    remove: removeVariable,
    replace,
  } = useFieldArray<IProductLocal, 'variables'>({
    control,
    name: 'variables',
  })

  useEffect(() => {
    let url: string | null = null

    if (imageFile) {
      url = URL.createObjectURL(imageFile)
      setImagePreviewUrl(url)
    } else if (product?.img) {
      setImagePreviewUrl(product.img)
    } else {
      setImagePreviewUrl(null)
    }
  }, [imageFile, product?.img])

  useEffect(() => {
    if (product && product.categories) {
      setSelectedCategories(product.categories)
    }
  }, [product])

  useEffect(() => {
    if (product) {
      setValue('name', product.name)
      setValue('slug', product.slug)
      setValue('description', product.description)
      setValue('statusLabel', product.statusLabel)

      if (product.nutritionalValue) {
        setValue('nutritionalValue', product.nutritionalValue)
      }

      if (product.variables && product.variables.length > 0) {
        const variablesWithNumberWeights = product.variables.map(
          (variable) => ({
            ...variable,
            weight: Number(variable.weight),
            price: Number(variable.price),
            newPrice: variable.newPrice ? Number(variable.newPrice) : 0,
            count: Number(variable.count),
          }),
        )
        replace(variablesWithNumberWeights)
      }
    }
  }, [product, setValue, replace])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const onSubmit = async (data: IProductLocal) => {
    if (isConfirmDeleteOpen) return

    setLoading(true)
    let result: IResult

    const image = imageFile ? await convertToBase64(imageFile) : ''

    const newData = {
      ...data,
      composition,
      visited: 0,
      categories: selectedCategories,
      variables: data.variables.map((variable) => ({
        ...variable,
        weight: Number(variable.weight),
        price: Number(variable.price),
        newPrice: variable.newPrice ? Number(variable.newPrice) : 0,
        count: Number(variable.count),
        sold: 0,
      })),
    }

    if (product?._id) {
      result = await editProduct(product._id, newData, image)
    } else {
      result = await createProduct(newData, image)
    }

    if (result.success) {
      setIsOpen(false)
      toast({
        title: result.message,
      })
    } else {
      toast({
        title: result.message,
      })
    }
    router.refresh()
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!product || !product._id) {
      return toast({ title: 'Product is not defined' })
    }

    setLoading(true)

    const result = await deleteProduct(product._id)

    if (result.success) {
      setIsConfirmDeleteOpen(false)
    }

    toast({
      title: result.message,
    })

    router.refresh()
    setLoading(false)
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId),
    )
  }

  useEffect(() => {
    setValue('categories', selectedCategories)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, setValue])

  const ConfirmDeletePopup = () => (
    <AlertDialog
      open={isConfirmDeleteOpen}
      onOpenChange={setIsConfirmDeleteOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Видалення</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Дійсно хочете видалити цей товар?
        </AlertDialogDescription>

        <AlertDialogFooter>
          <div className="flex w-full justify-end gap-3">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Так
            </Button>

            <Button
              variant="default"
              onClick={() => setIsConfirmDeleteOpen(false)}
              disabled={loading}
            >
              Ні
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <div>
      {loading && <Loading />}

      <ConfirmDeletePopup />

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button>{buttonTitle}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>{buttonTitle} товар</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <div className="max-h-[80svh] space-y-4 overflow-auto p-2">
                <div className="flex flex-col justify-between">
                  <div>
                    <Label htmlFor="name-uk">Назва (UK)</Label>
                    <Input
                      id="name-uk"
                      {...register('name.uk', {
                        required: 'Це поле є обов’язковим',
                      })}
                    />
                    {errors.name?.uk && (
                      <span className="text-red-700">
                        {errors.name.uk.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="name-en">Назва (EN)</Label>
                    <Input
                      id="name-en"
                      {...register('name.en', {
                        required: 'Це поле є обов’язковим',
                      })}
                    />
                    {errors.name?.en && (
                      <span className="text-red-700">
                        {errors.name.en.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="slug">URL-ідентифікатор (Slug)</Label>
                    <Input
                      id="slug"
                      {...register('slug', {
                        required: 'Це поле є обов’язковим',
                      })}
                    />
                    {errors.slug && (
                      <span className="text-red">{errors.slug.message}</span>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="picture">Додати зображення</Label>
                  <Input
                    id="picture"
                    type="file"
                    onChange={handleImageChange}
                  />
                </div>

                {imagePreviewUrl && (
                  <div>
                    <Label>Попередній перегляд зображення</Label>
                    <Image
                      src={imagePreviewUrl}
                      width={100}
                      height={100}
                      alt="Зображення продукту"
                      className="rounded-md"
                    />
                  </div>
                )}

                <div>
                  <Label>Категорії</Label>
                  <div className="max-h-[300px] overflow-auto border">
                    <CategoryTreeCheckbox
                      categories={categories}
                      selectedCategories={selectedCategories}
                      onCategoryChange={handleCategoryChange}
                    />
                  </div>
                </div>

                <div>
                  <h3>Склад</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <div>
                        <Label htmlFor="compositionInputUk">Склад (UK)</Label>
                        <Input
                          id="compositionInputUk"
                          list="composition-suggestions-uk"
                          value={compositionInput.uk}
                          onChange={(e) =>
                            setCompositionInput((prev) => ({
                              ...prev,
                              uk: e.target.value,
                            }))
                          }
                        />
                        <datalist id="composition-suggestions-uk">
                          {recommendations.composition.uk.map(
                            (item: string) => (
                              <option key={item} value={item} />
                            ),
                          )}
                        </datalist>
                      </div>
                      <div>
                        <Label htmlFor="compositionInputEn">
                          Composition (EN)
                        </Label>
                        <Input
                          id="compositionInputEn"
                          list="composition-suggestions-en"
                          value={compositionInput.en}
                          onChange={(e) =>
                            setCompositionInput((prev) => ({
                              ...prev,
                              en: e.target.value,
                            }))
                          }
                        />
                        <datalist id="composition-suggestions-en">
                          {recommendations.composition.en.map(
                            (item: string) => (
                              <option key={item} value={item} />
                            ),
                          )}
                        </datalist>
                      </div>
                      <Button
                        className="mt-6"
                        type="button"
                        onClick={() => {
                          setComposition((prev) => ({
                            en: [...prev.en, compositionInput.en],
                            uk: [...prev.uk, compositionInput.uk],
                          }))
                          setCompositionInput({ en: '', uk: '' })
                        }}
                      >
                        Додати
                      </Button>
                    </div>

                    {composition.uk.length > 0 && (
                      <div className="mt-4">
                        {composition.uk.map((itemUk, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-2 rounded-md border p-2 py-1"
                          >
                            <div>
                              uk: {itemUk} / en: {composition.en[index]}
                            </div>
                            <Button
                              variant="destructive"
                              type="button"
                              size="sm"
                              onClick={() => {
                                setComposition((prev) => ({
                                  en: prev.en.filter((_, i) => i !== index),
                                  uk: prev.uk.filter((_, i) => i !== index),
                                }))
                              }}
                            >
                              Видалити
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold">Харчова цінність</h2>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="nutritionalValue.proteins">Білки</Label>
                      <Input
                        id="nutritionalValue.proteins"
                        list="proteins-suggestions"
                        {...register('nutritionalValue.proteins', {
                          required: 'Це поле є обов’язковим',
                        })}
                      />
                      <datalist id="proteins-suggestions">
                        {recommendations.proteins.map((category: string) => (
                          <option key={category} value={category} />
                        ))}
                      </datalist>
                      {errors.nutritionalValue?.proteins && (
                        <span className="text-red-700">
                          {errors.nutritionalValue.proteins.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="nutritionalValue.fats">Жири</Label>
                      <Input
                        id="nutritionalValue.fats"
                        list="fats-suggestions"
                        {...register('nutritionalValue.fats', {
                          required: 'Це поле є обов’язковим',
                        })}
                      />
                      <datalist id="fats-suggestions">
                        {recommendations.fats.map((category: string) => (
                          <option key={category} value={category} />
                        ))}
                      </datalist>
                      {errors.nutritionalValue?.fats && (
                        <span className="text-red-700">
                          {errors.nutritionalValue.fats.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="nutritionalValue.carbohydrates">
                        Вуглеводи
                      </Label>
                      <Input
                        id="nutritionalValue.carbohydrates"
                        list="carbohydrates-suggestions"
                        {...register('nutritionalValue.carbohydrates', {
                          required: 'Це поле є обов’язковим',
                        })}
                      />
                      <datalist id="carbohydrates-suggestions">
                        {recommendations.carbohydrates.map(
                          (category: string) => (
                            <option key={category} value={category} />
                          ),
                        )}
                      </datalist>
                      {errors.nutritionalValue?.carbohydrates && (
                        <span className="text-red-700">
                          {errors.nutritionalValue.carbohydrates.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="nutritionalValue.energyValue">
                        Енергетична цінність
                      </Label>
                      <Input
                        id="nutritionalValue.energyValue"
                        list="energyValue-suggestions"
                        {...register('nutritionalValue.energyValue', {
                          required: 'Це поле є обов’язковим',
                        })}
                      />
                      <datalist id="energyValue-suggestions">
                        {recommendations.energyValue.map((category: string) => (
                          <option key={category} value={category} />
                        ))}
                      </datalist>
                      {errors.nutritionalValue?.energyValue && (
                        <span className="text-red-700">
                          {errors.nutritionalValue.energyValue.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description-uk">Опис (UK)</Label>
                  <Textarea
                    id="description-uk"
                    {...register('description.uk', {
                      required: 'Це поле є обов’язковим',
                    })}
                  />
                  {errors.description?.uk && (
                    <span className="text-red-700">
                      {errors.description.uk.message}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="description-en">Description (EN)</Label>
                  <Textarea
                    id="description-en"
                    {...register('description.en', {
                      required: 'This field is required',
                    })}
                  />
                  {errors.description?.en && (
                    <span className="text-red-700">
                      {errors.description.en.message}
                    </span>
                  )}
                </div>

                <Controller
                  name="statusLabel"
                  control={control}
                  defaultValue={product?.statusLabel || []}
                  render={({ field }) => (
                    <>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="new"
                          value="new"
                          checked={field.value?.includes('new') || false}
                          onCheckedChange={(checked) => {
                            const value = 'new'
                            if (checked) {
                              field.onChange([...field.value, value])
                            } else {
                              field.onChange(
                                field.value.filter((v) => v !== value),
                              )
                            }
                          }}
                        />
                        <label htmlFor="new">Новинка</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sale"
                          value="sale"
                          checked={field.value?.includes('sale') || false}
                          onCheckedChange={(checked) => {
                            const value = 'sale'
                            if (checked) {
                              field.onChange([...field.value, value])
                            } else {
                              field.onChange(
                                field.value.filter((v) => v !== value),
                              )
                            }
                          }}
                        />
                        <label htmlFor="sale">Акція</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="top"
                          value="top"
                          checked={field.value?.includes('top') || false}
                          onCheckedChange={(checked) => {
                            const value = 'top'
                            if (checked) {
                              field.onChange([...field.value, value])
                            } else {
                              field.onChange(
                                field.value.filter((v) => v !== value),
                              )
                            }
                          }}
                        />
                        <label htmlFor="top">Топ</label>
                      </div>
                    </>
                  )}
                />
                <div>
                  <h2 className="text-lg font-semibold">Вид</h2>
                  {variableFields.map((field, index) => (
                    <div key={field.id} className="mt-2 space-y-2 border p-4">
                      <div>
                        <Label htmlFor={`variables.${index}.weight`}>
                          Вага
                        </Label>
                        <Input
                          type={'number'}
                          id={`variables.${index}.weight`}
                          {...register(`variables.${index}.weight`, {
                            required: 'Це поле є обов’язковим',
                          })}
                        />
                        {errors.variables?.[index]?.weight && (
                          <span className="text-red-700">
                            {errors.variables[index].weight.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`variables.${index}.price`}>Ціна</Label>
                        <Input
                          type={'number'}
                          id={`variables.${index}.price`}
                          {...register(`variables.${index}.price`, {
                            required: 'Це поле є обов’язковим',
                          })}
                        />
                        {errors.variables?.[index]?.price && (
                          <span className="text-red-700">
                            {errors.variables[index].price.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`variables.${index}.newPrice`}>
                          Нова ціна
                        </Label>
                        <Input
                          type={'number'}
                          id={`variables.${index}.newPrice`}
                          {...register(`variables.${index}.newPrice`)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`variables.${index}.currency`}>
                          Валюта
                        </Label>
                        <Input
                          id={`variables.${index}.currency`}
                          {...register(`variables.${index}.currency`, {
                            required: 'Це поле є обов’язковим',
                          })}
                        />
                        {errors.variables?.[index]?.currency && (
                          <span className="text-red-700">
                            {errors.variables[index].currency.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`variables.${index}.count`}>
                          Кількість
                        </Label>
                        <Input
                          type={'number'}
                          id={`variables.${index}.count`}
                          {...register(`variables.${index}.count`, {
                            required: 'Це поле є обов’язковим',
                          })}
                        />
                        {errors.variables?.[index]?.count && (
                          <span className="text-red-700">
                            {errors.variables[index].count.message}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => removeVariable(index)}
                      >
                        Видалити вид
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() =>
                      appendVariable({
                        weight: 0,
                        price: 0,
                        newPrice: 0,
                        currency: '',
                        count: 0,
                      })
                    }
                    className="mt-2"
                  >
                    Додати вид
                  </Button>
                </div>
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <div className="flex w-full justify-between">
                {product ? (
                  <Button
                    variant="destructive"
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    disabled={loading}
                  >
                    Видалити
                  </Button>
                ) : (
                  <div />
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Скасувати
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {buttonTitle}
                  </Button>
                </div>
              </div>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default EditorProduct

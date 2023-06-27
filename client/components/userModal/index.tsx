import { NumberInput, TextInput, Input, SegmentedControl } from '@mantine/core'
import { useForm } from '@mantine/form'

import { UserType } from '@/types/User'
import { SexEnum } from '@/enums/Sex.enum'

import { ModalComponent } from '../modal'
import { ButtonComponent } from '../button'
import { UnitEnum } from '@/enums/Unit.enum'
import { MutateOptions } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { AvatarComponent } from '../avatar'
import { IconUpload } from '@tabler/icons-react'
import { api } from '@/api'

interface UserModalProps {
  user?: UserType
  opened: boolean
  loading: boolean

  onClose: () => void
  onSubmit: (user: UserType, options?: MutateOptions<UserType, unknown, UserType, unknown>) => void
}

export const UserModalComponent = ({ user, opened, loading, onClose, onSubmit }: UserModalProps) => {
  const isCreating = !user
  const hiddenFileInput = useRef<HTMLInputElement>(null)

  const {
    onSubmit: onSubmitForm,
    reset,
    getInputProps,
    setValues,
  } = useForm({
    initialValues: {
      name: user?.name || '',
      age: user?.age || 0,
      sex: user?.sex || SexEnum.WOMAN,
      height: user?.height || { value: undefined, unit: UnitEnum.CENTIMETERS },
      weight: user?.weight || { value: undefined, unit: UnitEnum.KILOS },
    },

    validate: {
      name: ({ length }) => (length < 2 ? 'Name must be at least 2 characters' : undefined),
      age: (age) => (age > 17 && age < 100 ? undefined : 'Invalid age: acceptable values are from 18 to 99 years-old'),
      sex: (sex) => (!sex ? 'Sex is required' : undefined),
      height: (height) => {
        if (!height || !height?.value) return undefined
        return height?.value > 99 && height?.value < 301
          ? undefined
          : 'Invalid height: acceptable values are from 100 cm to 300 cm'
      },
      weight: (weight) => {
        if (!weight || !weight?.value) return undefined
        return weight.value < 301 ? undefined : 'Invalid weight: acceptable values are from 30 kg to 300 kg'
      },
    },
  })

  useEffect(() => {
    setValues({ ...user })
  }, [user])

  const resetAndClose = () => {
    reset()
    onClose()
  }

  const handleClick = () => {
    hiddenFileInput?.current?.click()
  }

  const handleChange = async (file: File | undefined) => {
    if (!file) return
    const data = new FormData()
    data.append('file', file)
    console.log({ file })
    const res = await api.user.updateAvatar(user?._id, data)
    console.log({ res })
  }

  return (
    <ModalComponent opened={opened} onClose={resetAndClose} title={isCreating ? 'Add New User' : 'Edit User'}>
      <form
        onSubmit={onSubmitForm((values) => {
          onSubmit(
            { _id: user?._id || '', ...values },
            {
              onSuccess: resetAndClose,
            },
          )
        })}
      >
        <div className="flex items-end mb-4">
          <AvatarComponent src={user?.avatarUrl} centered={false} />
          <input
            type="file"
            className="hidden"
            ref={hiddenFileInput}
            onChange={(e) => handleChange(e.target.files?.[0])}
          />
          <ButtonComponent variant="icon" fullWidth={false} onClick={handleClick}>
            <IconUpload className="mr-2" size={22} />
            Upload image
          </ButtonComponent>
        </div>
        <TextInput label="Name" placeholder="Name" withAsterisk {...getInputProps('name')} />
        <NumberInput mt="sm" label="Age" placeholder="20" min={18} max={99} {...getInputProps('age')} />
        <Input.Wrapper mt="sm" withAsterisk label="Sex" className="flex flex-col" error={getInputProps('sex').error}>
          <SegmentedControl
            data={[
              { label: 'Woman', value: 'woman' },
              { label: 'Man', value: 'man' },
            ]}
            color="blue-200"
            transitionDuration={500}
            transitionTimingFunction="linear"
            {...getInputProps('sex')}
          />
        </Input.Wrapper>
        <TextInput
          mt="sm"
          label="Height"
          placeholder="185"
          withAsterisk
          rightSection={<p className="opacity-25 text-sm">{UnitEnum.CENTIMETERS}</p>}
          {...getInputProps('height.value')}
        />
        <TextInput
          mt="sm"
          mb="xl"
          label="Weight"
          placeholder="66"
          rightSection={<p className="opacity-25 text-sm">{UnitEnum.KILOS}</p>}
          {...getInputProps('weight.value')}
        />
        <ButtonComponent loading={loading} type="submit" variant="gradient">
          Submit
        </ButtonComponent>
      </form>
    </ModalComponent>
  )
}

import React from 'react'
import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/app/components/ui/form"
  import { Input } from "@/app/components/ui/input"
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder ?: string;
  type?: 'text' | 'email' | 'password' | 'file'
}

const FormField = <T extends FieldValues>  ({ control, name, label, placeholder, type = 'text'} : FormFieldProps<T>) =>  (
    <Controller 
      control={control}
      name={name}      
      render={({ field }) => (
        <FormItem>
            <FormLabel className='label'>{label}</FormLabel>
              <FormControl>
                  <Input className='input' placeholder={placeholder} {...field} type={type}  />
              </FormControl>
            <FormMessage />
        </FormItem>
      )} 
    />
  )


export default FormField
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { joiResolver } from '@hookform/resolvers/joi';
import { z } from 'zod';
import * as Joi from 'joi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Field = {
  name: string;
  type: 'text' | 'email' | 'number';
  label: string;
  rules: string;
  id?: string;
};
type FormData = {
  fields: Field[];
  resolver: 'zod' | 'joi';
  uiLib: 'shadcn' | 'mui' | 'chakra';
};

const schema = z.object({
  fields: z.array(
    z.object({
      name: z.string().min(1, 'Название поля обязательно'),
      type: z.enum(['text', 'email', 'number']),
      label: z.string().min(1, 'Label обязателен'),
      rules: z.string(),
    }),
  ),
  resolver: z.enum(['zod', 'joi']),
  uiLib: z.enum(['shadcn', 'mui', 'chakra']),
});

const GeneratedPreview = ({
  previewSchema,
  resolver,
  uiLib,
}: {
  previewSchema: Field[];
  resolver: string;
  uiLib: string;
}) => {
  // ✅ ФИЛЬТР ПУСТЫХ ПОЛЕЙ
  const validFields = previewSchema.filter((field) => field.name.trim());

  // ✅ ДИНАМИЧЕСКИЕ DEFAULT VALUES
  const defaultValues = validFields.reduce(
    (acc, field) => {
      acc[field.name] = '';
      return acc;
    },
    {} as Record<string, string>,
  );

  const previewForm = useForm({ defaultValues });

  if (!validFields.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Превью ({uiLib}, {resolver})
          </CardTitle>
        </CardHeader>
        <CardContent className="italic text-zinc-500 py-8 text-center">
          Добавьте поля с именами для превью
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Превью формы ({uiLib}, {resolver})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={previewForm.handleSubmit((data) =>
            console.log('Preview submit:', data),
          )}
          className="space-y-4"
        >
          {validFields.map((field) => (
            <div key={field.id || field.name} className="space-y-1">
              <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {field.label}
              </label>
              <Input
                {...previewForm.register(field.name, {
                  required: field.rules?.includes('required') || false,
                })}
                type={field.type}
                placeholder={field.label}
              />
              {previewForm.formState.errors[field.name] && (
                <p className="text-sm text-red-500">Обязательное поле</p>
              )}
            </div>
          ))}
          <Button type="submit" className="w-full">
            Тест submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fields: [
        {
          id: '1',
          name: 'email',
          type: 'email',
          label: 'Email',
          rules: 'email() | required()',
        },
      ],
      resolver: 'zod',
      uiLib: 'shadcn',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'fields',
  });

  const previewSchema = form.watch('fields');
  const resolver = form.watch('resolver');
  const uiLib = form.watch('uiLib');

  const onSubmit = (data: FormData) => {
    const json = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(json);
    console.log('✅ Сгенерировано и скопировано:', json);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-blue-50 to-indigo-100 dark:from-black dark:via-zinc-900 dark:to-zinc-950">
      <main className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 drop-shadow-lg">
            UniFormGen
          </h1>
          <p className="text-2xl md:text-3xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Универсальный генератор форм на React Hook Form.
            <br />
            Zod/Joi + shadcn/MUI/Chakra = готовый код за секунды 🚀
          </p>
          <Button
            size="lg"
            onClick={() => form.handleSubmit(onSubmit)()}
            className="text-xl px-12 h-14 shadow-2xl hover:shadow-blue-500/25"
          >
            Генерировать & Экспорт JSON
          </Button>
        </div>

        {/* Generator + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20 items-start">
          {/* Генератор полей */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🛠️ Построй форму
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resolver */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Validation Resolver
                </label>
                <Select
                  value={resolver}
                  onValueChange={(v) => form.setValue('resolver', v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zod">Zod</SelectItem>
                    <SelectItem value="joi">Joi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* UI Library */}
              <div className="space-y-2">
                <label className="text-sm font-medium">UI Library</label>
                <Select
                  value={uiLib}
                  onValueChange={(v) => form.setValue('uiLib', v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shadcn">shadcn/ui</SelectItem>
                    <SelectItem value="mui">Material-UI</SelectItem>
                    <SelectItem value="chakra">Chakra UI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fields */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                      <div className="md:col-span-1">
                        <Input
                          {...form.register(`fields.${idx}.name` as const)}
                          placeholder="fieldName"
                          className="h-10"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <Input
                          {...form.register(`fields.${idx}.label` as const)}
                          placeholder="Label"
                          className="h-10"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <Select
                          onValueChange={(v) =>
                            form.setValue(`fields.${idx}.type` as any, v)
                          }
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue
                              placeholder="Type"
                              defaultValue={'text'}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-1 flex gap-2">
                        <Input
                          {...form.register(`fields.${idx}.rules` as const)}
                          placeholder="email() | min(3)"
                          className="flex-1 h-10"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-10 px-3"
                          onClick={() => remove(idx)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={() =>
                  append({
                    name: '',
                    label: '',
                    type: 'text' as const,
                    rules: '',
                  })
                }
                variant="outline"
                className="w-full"
              >
                + Добавить поле
              </Button>
            </CardContent>
          </Card>

          {/* ✅ ИСПРАВЛЕННОЕ ПРЕВЬЮ */}
          <GeneratedPreview
            previewSchema={previewSchema}
            resolver={resolver}
            uiLib={uiLib}
          />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center gap-2">
                🔄 Resolvers
              </CardTitle>
            </CardHeader>
            <CardContent>
              Zod или Joi — автоматическая схема из правил.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center gap-2">
                🎨 UI Libs
              </CardTitle>
            </CardHeader>
            <CardContent>
              shadcn, MUI, Chakra — готовые адаптеры компонентов.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center gap-2">
                📥 Экспорт
              </CardTitle>
            </CardHeader>
            <CardContent>
              JSON + полный RHF код с типами TypeScript.
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

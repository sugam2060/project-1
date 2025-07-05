"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CardContent, CardFooter } from "../ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { ScrollArea } from "../ui/scroll-area";

import { InteriorSchema } from "@/schemas/InteriorSchema";
import {
  uploadInteriorImagesToCategory,
  getInteriorCategories,
  createInteriorCategory,
  deleteInteriorCategory,
} from "@/actions/ManagesMisc/InteriorPageMgmt";

export type InteriorFormValues = z.infer<typeof InteriorSchema>;

const RecentInteriorProjectsMgmt = () => {
  const [isPending, startTransition] = useTransition();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["interior-categories"],
    queryFn: getInteriorCategories,
  });

  

  const form = useForm<InteriorFormValues>({
    resolver: zodResolver(InteriorSchema),
    defaultValues: {
      images: [],
    },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (files: File[]) => void
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    onChange(files);
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setIsCreatingCategory(true);
    try {
      const result = await createInteriorCategory(newCategoryName.trim());
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success || "Category created successfully");
        setNewCategoryName("");
        queryClient.invalidateQueries({ queryKey: ["interior-categories"] });
      }
    } catch  {
      toast.error("Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const onSubmit = form.handleSubmit((data) => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    startTransition(() => {
      uploadInteriorImagesToCategory(data.images, selectedCategory).then(
        (res) => {
          if (res?.error) {
            toast.error(res.error);
          } else {
            toast.success(res.success || "Uploaded successfully");
            form.reset();
            queryClient.invalidateQueries({
              queryKey: ["interior-images", selectedCategory],
            });
          }
        }
      );
    });
  });

  const handleDeleteCategory = async (categoryId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This will also delete all images in this category."
      )
    ) {
      return;
    }

    setDeletingCategory(categoryId);
    try {
      const result = await deleteInteriorCategory(categoryId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Category deleted successfully");
        setSelectedCategory("");
        queryClient.invalidateQueries({ queryKey: ["interior-categories"] });
        queryClient.invalidateQueries({
          queryKey: ["interior-images", selectedCategory],
        });
      }
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeletingCategory(null);
    }
  };

  return (
    <div className="">
      {/* Create Category Section */}
      <div className="space-y-4 p-4 border rounded-lg bg-gray-50 mb-4">
        <h3 className="font-semibold text-base">Create New Category</h3>
        {categories.length >= 6 && (
          <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
            Maximum 6 categories reached. Please delete a category before creating a new one.
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Enter category name (e.g., Living Room, Kitchen)"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={isCreatingCategory || categories.length >= 6}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleCreateCategory}
            disabled={isCreatingCategory || !newCategoryName.trim() || categories.length >= 6}
            className="sm:w-auto"
          >
            {isCreatingCategory ? (
              <>
                Creating <Loader2 className="ml-2 animate-spin" />
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>

      {/* Categories List */}
      {categories.length > 0 && (
        <div className="space-y-3 mb-4">
          <h3 className="font-semibold text-base">Manage Categories</h3>

          <div className="h-[120px]">
            <ScrollArea className="h-full">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col px-2 py-1 border rounded-lg bg-white mb-2"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium text-sm">{category.name}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={deletingCategory === category.id}
                      className="ml-2 flex-shrink-0"
                    >
                      {deletingCategory === category.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={onSubmit}>
          <CardContent>
            {/* Category Selection */}
            <div className="space-y-2 mb-4">
              <label className="font-semibold text-base">Select Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded-md bg-white"
                disabled={categories.length === 0}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No categories available. Please create a category first.
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-base capitalize">
                    Upload Images (Max 6 per category)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, field.onChange)}
                      disabled={isPending || !selectedCategory}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                  {selectedCategory && (
                    <p className="text-xs text-muted-foreground">
                      Duplicate images will be automatically skipped.
                    </p>
                  )}
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full relative"
            >
              {isPending ? (
                <>
                  Uploading...
                  <Loader2 className="ml-2 animate-spin" />
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
};

export default RecentInteriorProjectsMgmt;

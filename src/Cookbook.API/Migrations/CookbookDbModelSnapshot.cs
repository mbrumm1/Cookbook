﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Cookbook.API.Migrations
{
    [DbContext(typeof(CookbookDb))]
    partial class CookbookDbModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.4");

            modelBuilder.Entity("Recipe", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Instructions")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Recipes");
                });

            modelBuilder.Entity("Recipe", b =>
                {
                    b.OwnsMany("Ingredient", "Ingredients", b1 =>
                        {
                            b1.Property<int>("RecipeId")
                                .HasColumnType("INTEGER");

                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("INTEGER");

                            b1.Property<string>("Name")
                                .IsRequired()
                                .HasColumnType("TEXT");

                            b1.Property<string>("OtherUnitDescription")
                                .HasColumnType("TEXT");

                            b1.Property<int>("Quantity")
                                .HasColumnType("INTEGER");

                            b1.Property<int>("Unit")
                                .HasColumnType("INTEGER");

                            b1.HasKey("RecipeId", "Id");

                            b1.ToTable("Recipes");

                            b1.ToJson("Ingredients");

                            b1.WithOwner()
                                .HasForeignKey("RecipeId");
                        });

                    b.Navigation("Ingredients");
                });
#pragma warning restore 612, 618
        }
    }
}

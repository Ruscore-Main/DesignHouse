using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace diplom_backend.Models
{
    public partial class HouseProjectDBContext : DbContext
    {
        public HouseProjectDBContext()
        {
        }

        public HouseProjectDBContext(DbContextOptions<HouseProjectDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Favorite> Favorites { get; set; }
        public virtual DbSet<HouseProject> HouseProjects { get; set; }
        public virtual DbSet<ProjectImage> ProjectImages { get; set; }
        public virtual DbSet<Request> Requests { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=HouseProjectDB;Trusted_Connection=True;");
            }

            optionsBuilder
                .UseLazyLoadingProxies();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.ToTable("Favorite");

                entity.HasOne(d => d.HouseProject)
                    .WithMany(p => p.Favorites)
                    .HasForeignKey(d => d.HouseProjectId)
                    .HasConstraintName("FK_Favorite_HouseProject");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Favorites)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Favorite_User");
            });

            modelBuilder.Entity<HouseProject>(entity =>
            {
                entity.ToTable("HouseProject");

                entity.Property(e => e.DatePublication).HasColumnType("datetime");

                entity.Property(e => e.Description).IsRequired();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<ProjectImage>(entity =>
            {
                entity.ToTable("ProjectImage");

                entity.Property(e => e.Image).IsRequired();

                entity.HasOne(d => d.HouseProject)
                    .WithMany(p => p.ProjectImages)
                    .HasForeignKey(d => d.HouseProjectId)
                    .HasConstraintName("FK_ProjectImage_HouseProject");
            });

            modelBuilder.Entity<Request>(entity =>
            {
                entity.ToTable("Request");

                entity.Property(e => e.ContentText).IsRequired();

                entity.Property(e => e.DateCreating).HasColumnType("datetime");

                entity.HasOne(d => d.HouseProject)
                    .WithMany(p => p.Requests)
                    .HasForeignKey(d => d.HouseProjectId)
                    .HasConstraintName("FK_Request_HouseProject");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Requests)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_User_Request");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.Email).IsRequired();

                entity.Property(e => e.Login)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Password).IsRequired();

                entity.Property(e => e.PhoneNumber)
                    .IsRequired()
                    .HasMaxLength(11);

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasMaxLength(5);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}

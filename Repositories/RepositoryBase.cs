using System.Collections.Generic;
using FlashCard.Contracts;
using FlashCard.Data;

namespace FlashCard.Repositories
{
	public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : class
	{
		protected ApplicationDbContext dbContext { get; }

		public RepositoryBase(ApplicationDbContext dbContext)
		{
			this.dbContext = dbContext;
		}

		public void Create(T entity)
		{
			dbContext.Set<T>().Add(entity);
		}

		public void Delete(T entity)
		{
			dbContext.Set<T>().Remove(entity);
		}

		public void DeleteRange(IEnumerable<T> entities)
		{
			dbContext.Set<T>().RemoveRange(entities);
		}

		public void Update(T entity)
		{
			dbContext.Set<T>().Update(entity);
		}
	}
}
import { useToastStore } from '@/store/toastStore';
import type { Article } from '@/type/articles';
import { useState, useEffect } from 'react';
import { getArticles } from '@/api/folder_admin/articles';
const Article = () => {
		const [articles, setArticles] = useState<Article[]>()

	const addToast = useToastStore((state) => state.addToast);
	const getArticlesData = async()=>{
		const res = await getArticles({})
		setArticles(res.data.articles)
	}

	useEffect(()=>{
		addToast('welcome', 'article', 'success');
		getArticlesData()
	},[])
	  return <div className="grid">{JSON.stringify(articles)}</div>;

  };


export default Article;

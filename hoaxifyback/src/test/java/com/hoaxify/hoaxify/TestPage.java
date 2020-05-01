package com.hoaxify.hoaxify;

import java.util.Iterator;
import java.util.List;
import java.util.function.Function;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class TestPage<T> implements Page<T>{
	
	long totalElements;
	int totalPages;
	int number;
	int numberOfElements;
	int size;
	boolean last;
	boolean first;
	boolean next;
	boolean previous;
	
	List<T> content;
	
	public void setContent(List<T> content) {
		this.content = content;
	}
	public long getTotalElements() {
		return totalElements;
	}
	public void setTotalElements(long totalElements) {
		this.totalElements = totalElements;
	}
	public int getTotalPages() {
		return totalPages;
	}
	public void setTotalPages(int totalPages) {
		this.totalPages = totalPages;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	public int getNumberOfElements() {
		return numberOfElements;
	}
	public void setNumberOfElements(int numberOfElements) {
		this.numberOfElements = numberOfElements;
	}
	public int getSize() {
		return size;
	}
	public void setSize(int size) {
		this.size = size;
	}
	public boolean isLast() {
		return last;
	}
	public void setLast(boolean last) {
		this.last = last;
	}
	public boolean isFirst() {
		return first;
	}
	public void setFirst(boolean first) {
		this.first = first;
	}
	public boolean isNext() {
		return next;
	}
	public void setNext(boolean next) {
		this.next = next;
	}
	public boolean isPrevious() {
		return previous;
	}
	public void setPrevious(boolean previous) {
		this.previous = previous;
	}
	@Override
	public List<T> getContent() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public boolean hasContent() {
		// TODO Auto-generated method stub
		return false;
	}
	@Override
	public Sort getSort() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public boolean hasNext() {
		// TODO Auto-generated method stub
		return next;
	}
	@Override
	public boolean hasPrevious() {
		// TODO Auto-generated method stub
		return previous;
	}
	@Override
	public Pageable nextPageable() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public Pageable previousPageable() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public Iterator<T> iterator() {
		// TODO Auto-generated method stub
		return null;
	}
	@Override
	public <U> Page<U> map(Function<? super T, ? extends U> converter) {
		// TODO Auto-generated method stub
		return null;
	}
	
}

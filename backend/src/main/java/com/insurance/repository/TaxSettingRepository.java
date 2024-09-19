package com.insurance.repository;



import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.insurance.entities.TaxSetting;

public interface TaxSettingRepository extends JpaRepository<TaxSetting,Long> {


	    @Query("SELECT t FROM TaxSetting t ORDER BY t.updatedAt DESC")
	    Page<TaxSetting> findLatestTaxSetting(Pageable pageable);
	}



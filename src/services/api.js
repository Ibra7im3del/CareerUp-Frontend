import API from './axios';

// جلب الوظائف مع الفلاتر والـ Pagination من السيرفر
// params: { search, location, jobType, sort, pageNumber, pageSize }
export async function fetchJobs(params = {}) {
  try {
    // نشيل القيم الفاضية عشان متتبعتش في الـ URL
    const clean = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );
    const { data } = await API.get('/jobs', { params: clean });
    return data;
  } catch (error) {
    console.error('API Error fetching jobs:', error);
    return null;
  }
}

// التقديم على وظيفة مع الـ CV (multipart/form-data) ومعاه الـ token عن طريق الـ interceptor
export async function submitJobApplication(applicationData) {
  const formData = new FormData();
  formData.append('JobId', applicationData.jobId);
  formData.append('CvFile', applicationData.cvFile);
  formData.append('CoverLetter', applicationData.coverLetter || '');
  formData.append('FullName', applicationData.fullName);
  formData.append('Email', applicationData.email);
  formData.append('Phone', applicationData.phone);
  formData.append('Country', applicationData.country);
  formData.append('Experience', applicationData.experience);
  formData.append('LinkedinUrl', applicationData.linkedinUrl);
  formData.append('GithubUrl', applicationData.githubUrl);
  formData.append('PortfolioUrl', applicationData.portfolioUrl || '');

  // ممنوع نحط Content-Type يدوي، axios بيظبطه مع الـ FormData
  const { data } = await API.post('/jobapplications', formData);
  return data;
}

// ===== الوظائف المحفوظة (من الداتابيز) =====

// بيرجّع الوظائف المحفوظة، وأول مرة بينقل المحفوظات القديمة من localStorage للسيرفر
export async function fetchSavedJobs() {
  try {
    const local = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (Array.isArray(local) && local.length > 0) {
      await API.post('/savedjobs/import', { jobIds: local });
      localStorage.removeItem('savedJobs');
    }
  } catch (error) {
    // لو النقل فشل نسيب القائمة القديمة ونحاول المرة الجاية
    console.warn('Saved jobs import failed, will retry later.', error);
  }

  const { data } = await API.get('/savedjobs');
  return Array.isArray(data) ? data : [];
}

export const saveJob = (jobId) => API.put(`/savedjobs/${jobId}`);
export const unsaveJob = (jobId) => API.delete(`/savedjobs/${jobId}`);
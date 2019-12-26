import http from '@src/services/http';
import PappModel from '@src/models/papp';

export const submitPapp = ({
  title,
  link,
  shortDescription = '',
  fullDescription = '',
  logoFile,
  imageFiles = [],
  contactWebsite = '',
  contactEmail = '',
  contactPhone = '',
  privacyPolicyUrl = '',
  notSubmitPrivacy = false,
  id = ''
}) => {
  if (!title) throw new Error('Missing title');
  if (!link) throw new Error('Missing link');
  if (!shortDescription) throw new Error('Missing shortDescription');
  if (!fullDescription) throw new Error('Missing fullDescription');
  if (!logoFile) throw new Error('Missing logoFile');
  if (imageFiles?.length < 1) throw new Error('Missing imageFiles');

  const form = new FormData();
  form.append('Logo', logoFile ? {
    name: logoFile.name,
    uri: logoFile.uri,
    type: logoFile.type
  } : undefined);

  form.append('ID', id);
  form.append('Title', title);
  form.append('Link', link);
  form.append('ShortDescription', shortDescription);
  form.append('FullDescription', fullDescription);
  form.append('ContactWebsite', contactWebsite);
  form.append('ContactEmail', contactEmail);
  form.append('ContactPhone', contactPhone);
  form.append('PrivacyPolicyUrl', privacyPolicyUrl);
  form.append('NotSubmitPrivacy', notSubmitPrivacy);

  imageFiles.forEach((imageFile, index) => {
    imageFile && form.append(`Image${index + 1}`, {
      name: imageFile.name,
      uri: imageFile.uri,
      type: imageFile.type
    });
  });

  return http.post('papp/submit', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  }).then(res => {
    return new PappModel(res);
  });
};



export const getPappList = ({ keyword, status, type, userId, page = 1, limit = 1000 } = {}) => http.get('papp/list', {
  params: {
    limit,
    page,
    ...userId ? { user_id: userId } : {},
    ...type ? { type } : {},
    ...status ? { status } : {},
    ...keyword ? { keyword } : {},
  }
}).then(res => {
  const { PApps } = res || {};
  return PApps?.map(papp => new PappModel(papp));
});
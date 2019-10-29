import os
import sys
import fnmatch
import re
import zipfile
import json
import urllib
import requests
import xlrd
from random import randint
from random import choice
import shutil

def template_fix(token, server):

	token = token.replace(' ', '')

	if os.name == 'nt':
		os.chdir('C:\\test\\')
		archive_path = 'C:\\test\\generic.zip'
	elif os.name == 'posix':
		os.chdir('/home/mrukhlov')
		archive_path = '/home/mrukhlov/agents_temp/generic_agent.zip'

	if server == 'prod':
		link = 'https://console.api.ai/api/agent/'
	if server == 'stage':
		link = 'http://openapi-stage/api/agent/'
	if server == 'dev':
		link = 'https://gdev.api.ai/api/agent/'

	if os.path.exists(archive_path) == True:
		os.remove(archive_path)

	testfile = urllib.URLopener()
	try:
		r = testfile.retrieve(link+"?access_token=" + token, archive_path)
	except IOError:
		return {'status':{'code':400},'message':'wrong token'}

	path = archive_path[:-4]
	if os.path.exists(path) == True:
		shutil.rmtree(path)

	z = zipfile.ZipFile(archive_path)
	for name in z.namelist():
		z.extract(name, path)

	path = os.path.join(path, 'intents')
	print path

	for file in os.listdir(path):
		print file
		ent_num = 0
		filen = os.path.join(path, file)
		temp_check = False
		last_text = False
		print filen
		with open(filen, 'r+') as f:
			syn_list = []
			json_file = json.loads(f.read())
			usersays_len = len(json_file['userSays'])
			for i in json_file['userSays']:
				if i['isTemplate'] == True:
					default_data = i['data'][0]
					temps = re.findall("(@(\w+)(\.\w+)*:(\w+)('s)*)", default_data['text'])
					if temps:
						temps = [list(a) for a in temps]
						for tmpp in temps:
							if len(tmpp[4]) > 0:
								tmpp[3]=tmpp[3]+tmpp[4]

						lst = temps
						temps_dict = {k[0]:k for k in lst}
						text_split = default_data['text'].split(' ')
						finished_list = []
						text_list = []
						for text in text_split:
							if temps_dict.has_key(text) or temps_dict.has_key(text+"'s"):
								last_text = False
								list_item = temps_dict[text.replace('?', '').replace('!', '') or temps_dict.has_key(text.replace('?', '').replace('!', ''))]
								if len(list_item[2]) < 1:
									if len(text_list) > 0 and {'text':' '.join(text_list)} not in finished_list:
										if len(finished_list) > 0:
											if finished_list[-1]['text'] == ' ':
												finished_list[-1] = {'text': ' '+' '.join(text_list) + ' '}
											else:
												finished_list.append({'text':' '+' '.join(text_list)+' '})
										else:
											finished_list.append({'text': ' '.join(text_list) + ' '})
										text_list = []
									entityFile = os.path.join(os.path.join(archive_path[:-4], 'entities'), list_item[1].replace('@','')+'.json')
									with open(entityFile) as ff:
										ent = json.loads(ff.read())
										try:
											ent_text = ent['entries'][ent_num]['value']
										except IndexError:
											ent_num = 1
											ent_text = ent['entries'][ent_num]['value']
										ent_num += 1
									dct = {
										'text': ent_text,
										'alias': list_item[3],
										'meta': '@'+list_item[1],
										'userDefined': False
									}
									finished_list.append(dct)
									finished_list.append({'text': ' '})
									temp_check = True
								else:
									dct = {
										'text': list_item[3],
										'alias': list_item[3],
										'meta': '@'+str(list_item[1])+str(list_item[2]),
										'userDefined': False
									}
									finished_list.append(dct)
									finished_list.append({'text': ' '})
									temp_check = True
							else:
								if last_text == False:
									if len(finished_list) > 0 and finished_list[-1] == {'text': " "}:
										finished_list[-1] = {'text': ' ' + text + ' '}
									else:
										finished_list.append({'text': text + ' '})
								else:
									if len(finished_list) > 0:
										finished_list[-1]['text'] += text + ' '
									else:
										finished_list.append({'text': text + ' '})
								last_text = True

						if len(finished_list) > 0:
							if finished_list[0]['text'][0] == ' ':
								finished_list[0]['text'] = finished_list[0]['text'][1:]
							if finished_list[-1]['text'][-1] == ' ':
								finished_list[-1]['text'] = finished_list[-1]['text'][:-1]

						if finished_list[-1] == {'text': ""}:
							finished_list.remove({'text': ""})

						i['data'] = finished_list
					else:
						finished_list = []
						finished_list.append({'text': default_data['text']})
				i['isTemplate'] = False

			f.seek(0)
			f.write(json.dumps(json_file))
			f.truncate()

	# if os.name == 'posix':
	# 	os.remove(archive_path)

	shutil.make_archive(os.path.join(archive_path[:-4],'generic'), 'zip', archive_path[:-4])
	# archive_path = os.path.join(archive_path[:-4],'generic.zip')
	# fileobj = open(archive_path, 'rb')
	fileobj = open(os.path.join(archive_path[:-4],'generic.zip'), 'rb')
	headers = {'Authorization': 'Bearer ' + token}
	r = requests.post(link + '?clear=true', headers=headers, files={"archive": ('generic.zip', fileobj)})
	print json.loads(r.text)['status']['code']
	print r.json()

	fileobj.close()

	if os.name == 'posix':
		os.remove(archive_path)
		shutil.rmtree(archive_path[:-4])
	# else:
	# 	os.remove(archive_path)
	# 	shutil.rmtree(archive_path[:-4])

	return json.loads(r.text)
# -*- coding: utf-8 -*-

import StringIO
import cStringIO as StringIO
import csv
import fnmatch
import json
import logging
import os
import random
import re
import shutil
import subprocess
import urllib
import urllib2
import urlparse
import xml.etree.ElementTree as ET
import zipfile
from StringIO import StringIO
from datetime import date
from datetime import datetime, timedelta
from time import *
from urllib2 import HTTPError

import grequests
import gspread
import psycopg2
import requests
import xlrd
from bs4 import BeautifulSoup
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.core.servers.basehttp import FileWrapper
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.template.defaulttags import register
from django.views.decorators.csrf import csrf_exempt
# try:
# 	from oauth2client.client import SignedJwtAssertionCredentials
# except ImportError:
# 	from oauth2client.service_account import ServiceAccountCredentials
from xlsxwriter.workbook import Workbook

from inputs.forms import InputsModelExtendedForm, LoginForm, InputsModelExtendedResolvedForm, MetaCreateForm, \
	WikiListCreateForm, CrowdinReloadFileForm, UploadFileForm, UploadCrowdinVmFileForm, UploadCrowdinCsvFileForm, \
	UploadCrowdinArchiveFileForm, UploadCrowdinVmFileUploadForm
from inputs.models import InputsModelExtended, InputsModelExtendedResolved, PageTableModel
from tools import *
from scripts import template_fix

logr = logging.getLogger('testlogger')
email_logr = logging.getLogger('login_mail_logger')


def chdir(path):
	try:
		os.chdir(path)
	except:
		os.makedirs(path)


@register.filter
def get_item(dictionary, key):
	return dictionary.get(key)


@register.filter(name='lookup')
def cut(value, arg):
	return value[arg]


# in forms
@csrf_exempt
def input_form(request):
	if request.user.is_authenticated():
		form = InputsModelExtendedForm(initial={'language': 'EN', 'service': 'Choose service',
		                                        'service': 'Choose action'})  # passing form to template
		InputsAll = InputsModelExtended.objects.all()  # passing all objects to template
		if request.method == 'POST':
			Inputs = InputsModelExtendedForm(request.POST)  # passing form to template
			if Inputs.is_valid():
				action = request.POST['service']
				input = request.POST['input']
				input_form_send_mail(action, input)
				Inputs.save()
		return render(request, 'inputs_forms_css.html', {'form': form, 'InputsAll': InputsAll, 'id': id})
	else:
		return redirect('login')


def resolved(request):
	if request.user.is_authenticated():
		form = InputsModelExtendedResolvedForm  # passing form to template
		InputsAll = InputsModelExtendedResolved.objects.all()  # passing all objects to template
		return render(request, 'inputs_forms_resolved_css.html', {'form': form, 'InputsAll': InputsAll, 'id': id})
	else:
		return redirect('login')


def remove(request):
	input_num = request.GET['input_num']
	if input_num is not None:
		input_remove = InputsModelExtended.objects.get(pk=input_num)
		input_remove.delete()
		return redirect('input_page')
	else:
		return redirect('input_page')


def remove_resolved(request):
	input_num = request.GET['input_num']
	if input_num is not None:
		input_remove = InputsModelExtendedResolved.objects.get(pk=input_num)
		input_remove.delete()
		return redirect('resolved')
	else:
		return redirect('resolved')


def remove_group(request):
	if request.method == 'POST':
		list_of_input_ids = request.POST.getlist('inputs')
		if list_of_input_ids is not None:
			for num in list_of_input_ids:
				input_remove = InputsModelExtended.objects.get(pk=num)
				input_remove.delete()
		return redirect('input_page')
	else:
		return redirect('input_page')


def remove_group_res(request):
	if request.method == 'POST':
		list_of_input_ids = request.POST.getlist('inputs')
		if list_of_input_ids is not None:
			for num in list_of_input_ids:
				input_remove = InputsModelExtendedResolved.objects.get(pk=num)
				input_remove.delete()
		return redirect('resolved')
	else:
		return redirect('resolved')


def remove_group_res_all(request):
	if request.method == 'POST':
		input_remove = InputsModelExtendedResolved.objects.all()
		input_remove.delete()
		return redirect('resolved')
	else:
		return redirect('resolved')


def resolve_group(request):
	if request.method == 'POST':
		list_of_input_ids = request.POST.getlist('inputs')
		if list_of_input_ids is not None:
			for num in list_of_input_ids:
				input_resolve = InputsModelExtended.objects.get(pk=num)
				text = str(input_resolve)
				service_get = input_resolve.service
				action_get = input_resolve.action
				object_get = input_resolve.object
				input_get = input_resolve.input
				resolve_goup_send_email(text)
				b = InputsModelExtendedResolved(service=service_get, action=action_get, object=object_get,
				                                input=input_get)
				b.save()
				input_resolve.delete()
		return redirect('input_page')
	else:
		return redirect('input_page')


def resolve(request):
	input_num = request.GET['input_num']
	if input_num is not None:
		input_resolve = InputsModelExtended.objects.get(pk=input_num)
		text = str(input_resolve)
		service_get = input_resolve.service
		action_get = input_resolve.action
		object_get = input_resolve.object
		input_get = input_resolve.input
		resolve_goup_send_email(text)
		b = InputsModelExtendedResolved(service=service_get, action=action_get, object=object_get, input=input_get)
		b.save()
		input_resolve.delete()
		return redirect('input_page')
	else:
		return redirect('input_page')


def edit(request):
	InputsAll = InputsModelExtended.objects.all()  # passing objects to template
	input_num = request.GET['input_num']
	input_edit = InputsModelExtended.objects.get(pk=input_num)
	if input_num is not None:
		if request.method == 'POST':
			form = InputsModelExtendedForm(request.POST, instance=input_edit)
			if form.is_valid():
				form.save()
				return redirect('input_page')

	form = InputsModelExtendedForm(instance=input_edit)
	return render(request, 'inputs_forms_edit_css.html',
	              {'form': form, 'InputsAll': InputsAll, 'InputEdit': input_edit, 'Input': input_num})


def test_conn(request):
	return HttpResponse('conn test ' + str(request))


def log_in(request):
	if not request.user.is_authenticated():
		if request.method == 'POST':
			form = LoginForm(request.POST)
			if form.is_valid():
				if form.get_user():
					login(request, form.get_user())
					email_logr.debug(str(form.get_user()) + ' login')
					return HttpResponseRedirect('/')
		else:
			form = LoginForm()
		return render(request, 'login.html', {'form': form})
	else:
		return HttpResponseRedirect('/')


def log_out(request):
	logout(request)
	return redirect('login')


def upload_ru_morph(request):
	if request.method == "POST":
		form = UploadFileForm(request.POST, request.FILES)
		if form.is_valid():
			input_file = request.FILES.get('file')
			rb = xlrd.open_workbook(file_contents=input_file.read())
			sheet = rb.sheet_by_index(0)
			row = sheet.col_values(0)
			morpheme_list = []
			morpheme_dict = {}
			for req in row:
				req = req.encode('utf-8')
				request = urllib2.quote(req)
				link = 'http://www.morfologija.ru/%D1%81%D0%BB%D0%BE%D0%B2%D0%BE%D1%84%D0%BE%D1%80%D0%BC%D0%B0/' + request
				pageFile = urllib2.urlopen(link).read()
				soup = BeautifulSoup(pageFile)
				for table in soup.select('table.gramemasTable'):
					tr = table.find_all('td')
					for row in tr:
						a = row.find_all('a')
						for found_link in a:
							if found_link.text not in morpheme_list:
								morpheme_list.append(found_link.text)
							# print found_link.text
				if len(morpheme_list) > 0:
					morpheme_dict[req] = morpheme_list
				morpheme_list = []
			meta_name = 'morpheme-list.meta'
			meta_upper = '<meta name="meta.morph-list" lang="ru">'
			text = ''
			text += meta_upper + '\n'
			for item in morpheme_dict:
				for item_elem in morpheme_dict[item]:
					text += '\n<pattern>' + item_elem + '</pattern>'
				text += '\n<velocity>\n\t#return("' + item.decode('utf-8') + '")\n</velocity>\n'
			text += '\n</meta>'
			response = HttpResponse(content_type='application/force-download')
			response['Content-Disposition'] = 'attachment; filename=' + meta_name
			response.write(text)
			return response


def upload_crowdin(request):
	req = urllib2.Request(assistant_linguistics_english_info)
	try:
		resp = urllib2.urlopen(req)
	except:
		return render_to_response('crowdin_upload.html')
	content = resp.read()

	path = ''
	dir_found = False

	name = ''

	dir = ''
	dir1 = ''
	dir2 = ''

	files_list = []

	root = ET.fromstring(content)
	for file in root.findall('files'):
		for item in file.findall('item'):
			if item.find('node_type').text == 'directory':
				dir += item.find('name').text + '/'
			else:
				name = item.find('name').text
			path = name
			csv_found = re.search('\.csv', path)
			if csv_found:
				files_list.append(path)
			for elem in item.findall('files'):
				for elem_2 in elem.findall('item'):
					if elem_2.find('node_type').text == 'directory':
						dir1 = dir + elem_2.find('name').text + '/'
					else:
						name = elem_2.find('name').text
					path = dir + name
					csv_found = re.search('\.csv', path)
					if csv_found:
						files_list.append(path)
					for elem_3 in elem_2.findall('files'):
						for elem_4 in elem_3.findall('item'):
							if elem_4.find('node_type').text == 'directory':
								dir2 = dir1 + elem_4.find('name').text + '/'
							else:
								name = elem_4.find('name').text
							path = dir1 + name
							csv_found = re.search('\.csv', path)
							if csv_found:
								files_list.append(path)
							for elem_5 in elem_4.findall('files'):
								for elem_6 in elem_5.findall('item'):
									if elem_6.find('node_type').text == 'directory':
										dir3 = dir2 + elem_6.find('name').text + '/'
									else:
										name = elem_6.find('name').text
									path = dir2 + name
									csv_found = re.search('\.csv', path)
									if csv_found:
										files_list.append(path)
									for elem_7 in elem_6.findall('files'):
										for elem_8 in elem_7.findall('item'):
											if elem_8.find('node_type').text == 'directory':
												dir4 = dir3 + elem_8.find('name').text + '/'
											else:
												name = elem_8.find('name').text
											path = dir3 + name
											csv_found = re.search('\.csv', path)
											if csv_found:
												files_list.append(path)

			dir = ''
			name = ''

	req = urllib2.Request(assistant_linguistics_english_status)
	resp = urllib2.urlopen(req)
	content = resp.read()

	root = ET.fromstring(content)
	for language in root.findall('language'):
		phrases = int(language.find('phrases').text)
		translated = int(language.find('translated').text)
		words = int(language.find('words').text)
	percent = translated * 100 / phrases
	files_list_split = [item.split("/") for item in files_list]

	files_split_dic = {}
	for item in files_list:
		slash = item.find('/')
		key = item[:slash]
		if files_split_dic.has_key(key):
			files_split_dic[key].append(item[slash + 1:])
		else:
			files_split_dic[key] = [item[slash + 1:]]

	# print files_split_dic

	files_split_split_dic = {key: [i.split('/') for i in value] for key, value in files_split_dic.items()}

	def to_nested_dict(list_dict):
		d = {}
		for key, val in list_dict.items():
			if len(val[0]) > 1:
				d[key] = {}
				try:
					for x, y in val:
						d[key].setdefault(x, []).append(y)
				except ValueError:
					for x in val:
						if len(x) < 2:
							'''print x
							print d[key]
							d[key].append(x)'''
							pass
			else:
				d[key] = []
				for x in val:
					d[key].append(x)
		return d

	files_split_split_split_dic = to_nested_dict(files_split_split_dic)

	if request.user.is_authenticated():
		form = UploadFileForm()
		form_vm = UploadCrowdinVmFileForm()
		form_csv = UploadCrowdinCsvFileForm()
		form_archive = UploadCrowdinArchiveFileForm()
		crowdin_file_form = CrowdinReloadFileForm()
		form_vm_upload = UploadCrowdinVmFileUploadForm()
		return render_to_response('crowdin_upload.html',
		                          {'form': form, 'form_archive': form_archive, 'form_csv': form_csv, 'form_vm': form_vm,
		                           'form_vm_upload': form_vm_upload, "crowdin_file_form": crowdin_file_form,
		                           "files_list": sorted(files_list), "percent": percent,
		                           "files_list_split": files_list_split,
		                           "files_split_dic": sorted(files_split_dic.iteritems()),
		                           "files_split_split_dic": sorted(files_split_split_dic.iteritems()),
		                           "files_split_split_split_dic": sorted(files_split_split_split_dic.iteritems())},
		                          context_instance=RequestContext(request))
	else:
		return redirect('login')


def vm_to_csv(request):
	response = HttpResponse(content_type='application/force-download')

	end = '#end'
	tab = '\t'
	double_tab = '\t\t'
	randomm = '#random\(\)'
	macro_name = '#macro\((.*)\)'
	new_stroke = '^\n$'
	descr = '##(.*)'

	work_string = ''
	rec = False
	rec_init = False
	first_run_check = True
	first_input_check = False
	descr_found = False
	one_string_macro = False

	if request.method == "POST":
		input_file = request.FILES.get('file_vm')
		if input_file:
			for string in input_file:

				tab_match = re.search(tab, string)
				if tab_match:
					string = re.sub(tab, '', string)
					string = re.sub('	', '', string)
					string = re.sub('	', '', string)
					string = re.sub('\t', '', string)

				random = re.search(randomm, string)
				if random:
					string = re.sub(randomm, '', string)

				double_tab_match = re.search(tab, string)
				if double_tab_match:
					string = re.sub(double_tab, '', string)

				end_match = re.search(end, string)
				if end_match:
					string = re.sub(end, '', string)

				new_stroke = (new_stroke, string)
				r_search = ('\r', string)
				if new_stroke:
					string = re.sub('^\n$', '', string)
				if r_search:
					string = re.sub('\r', '', string)

				descr = re.search('^##\s*(.*)', string)
				if descr:
					first_input_check = True
					description = descr.group(1)
					if len(description) > 0:
						descr_found = True
					if rec == False:
						rec = True
					else:
						rec = False

				macro_name = re.search('#macro\((.*)\)', string)
				if macro_name:
					args_search = re.search('\$[a-zA-Z]+', macro_name.group(1))
					if not args_search:
						first_input_check = True
						string = re.sub('#macro\((.*)\)', macro_name.group(1), string)

						new_stroke_end = re.search('\n$', string)
						if new_stroke_end:
							string = re.sub('\n$', '', string)

						macro_name_string = string
					else:
						one_string_macro = True
						first_input_check = True
						li_search = re.search('#li\(\)', string)
						li_string_search = re.search('#li\(\)(.*)', string)
						if li_search:
							macro_name_li = re.search('#macro\((.*)\)#li\(\)', string)
							string = macro_name_li.group(1)
							macro_name_string = string
							if li_string_search:
								input_string = li_string_search.group(1)

				if not macro_name and not descr:
					new_stroke_end = re.search('\n$', string)
					if new_stroke_end:
						string = re.sub('\n$', '', string)
					double_qoute = re.search('"', string)
					if double_qoute:
						string = re.sub('"', '\'', string)
					if new_stroke_end:
						string = re.sub('\n$', '', string)
					input = string
					descr_found = False

				# descr_check = False

				space_seacrh = re.search('^\s{2,5}', string)

				if rec == True:
					if descr and len(description) > 0:
						first_input_check = True
						if first_run_check == True:
							work_string += description + '\t'
							first_run_check = False
						else:
							work_string += '\n' + description + '\t'
					elif macro_name:
						if one_string_macro != True:
							if descr_found == True:
								work_string += macro_name_string + '\t'
							elif descr_found == False:
								if first_run_check == True:
									work_string += 'no description\t' + macro_name_string + '\t'
									first_run_check = False
								else:
									work_string += '\nno description\t' + macro_name_string + '\t'
							one_string_macro = False
						else:
							if descr_found == True:
								work_string += macro_name_string + '\t' + input_string
							elif descr_found == False:
								work_string += '\nno description\t' + macro_name_string + '\t' + input_string
							one_string_macro = False
					elif not macro_name and not descr and len(string) > 0 and not space_seacrh:
						if first_input_check == True:
							work_string += string
							first_input_check = False
						elif first_input_check == False:
							work_string += '/n' + string  # repeat.vm
						# work_string += string

				if rec == False:
					if descr and len(description) > 0:
						first_input_check = True
						work_string += '\n' + description + '\t'
					elif macro_name:
						if one_string_macro != True:
							if descr_found == True:
								work_string += macro_name_string + '\t'
							elif descr_found == False:
								if first_run_check == True:
									work_string += 'no description\t' + macro_name_string + '\t'
									first_run_check = False
								else:
									work_string += '\nno description\t' + macro_name_string + '\t'
							one_string_macro = False
						else:
							if descr_found == True:
								work_string += macro_name_string + '\t' + input_string
							elif descr_found == False:
								work_string += '\nno description\t' + macro_name_string + '\t' + input_string
							one_string_macro = False
					elif not macro_name and not descr and len(string) > 0 and not space_seacrh:
						if first_input_check == True:
							work_string += string
							first_input_check = False
						elif first_input_check == False:
							work_string += '/n' + string  # repeat.vm
						# work_string += string

				description = ''
				macro_name = ''
				string = ''

			work_string = re.sub('\r', '', work_string)
			work_string = re.sub('   ', '', work_string)
			work_string = re.sub('\t\s', '\t', work_string)
			work_string = re.sub('\t/n', '\t', work_string)
			work_string = re.sub('\t$', '', work_string)
			response.write(work_string)
			file_name = request.FILES['file_vm'].name[:-3] + '.csv'
			response['Content-Disposition'] = 'attachment; filename=' + file_name

			return response
		return HttpResponseRedirect('/upload_crowdin/')


def csv_to_vm(request):
	search_match_list = []
	response = HttpResponse(content_type='application/force-download')

	work_stringg = ''

	if request.method == "POST":
		input_file = request.FILES.get('file_csv')
		if input_file:
			input_filee = re.sub('\n^"\n', '"', str(input_file))
			for stringg in input_file:
				try:
					quotes_search = re.search('["]?(.*)[,\s]?\t(.*)[,\s]?\t(.*)["]?', stringg)
					if not quotes_search:
						quotes_search_cut = re.search('"\w+(\s\$\S+)*\n', stringg)
						if quotes_search_cut:
							continue
						quotes_search_cut_left = re.search('"(.*)"\t"(.*)"\t"(.*)"', stringg)
						quotes_search_cut_left1 = re.search('(.*)"\t"(.*)"\t"(.*)"', stringg)
						if quotes_search_cut_left or quotes_search_cut_left1:
							quotes_search = quotes_search_cut_left
				except re.error:
					quotes_search = re.search('(.*)\t(.*)\t(.*)', stringg)

				if quotes_search:
					if quotes_search.groups() not in search_match_list:
						search_match_list.append(quotes_search.groups())
					descr = quotes_search.group(1)
					macro_name = quotes_search.group(2)
					say = quotes_search.group(3)

				new_lines_search = re.search('/n', say)
				if new_lines_search:
					say = re.sub('/n', '\n\t\t', say)

			for i in search_match_list:
				descr = re.sub('"', '', i[0])
				macro_name = re.sub('"', '', i[1])
				say = re.sub('"', '', i[2])
				say = re.sub('\/n', '\n\t\t', say)
				work_stringg += '##' + descr + '\n#macro(' + macro_name + ')\n\t#random()\n\t\t' + say + '\n\t#end\n#end\n\n'
			work_stringg = re.sub('""', '"', work_stringg)
			response.write(work_stringg)
			file_name = request.FILES['file_csv'].name[:-4] + '.vm'
			response['Content-Disposition'] = 'attachment; filename=' + file_name

			return response
		return HttpResponseRedirect('/upload_crowdin/')


def csv_archive_to_vm(request):
	zipdata = StringIO()
	response = HttpResponse(content_type='application/force-download')

	if request.method == "POST":
		input_file = request.FILES.get('file_archive')
		if input_file:
			zf = zipfile.ZipFile(input_file)
			for info in zf.infolist():
				search_match_list = []
				work_string = ''
				path = re.search('(.*\.csv)', info.filename)
				path_name = re.search('(.*/)(.*\.csv)', info.filename)
				for string in zf.open(info.filename):
					try:
						quotes_search = re.search('(.*)[,\s]?\t(.*)[,\s]?\t(.*)', string)
						if not quotes_search:
							quotes_search_cut = re.search('"\w+(\s\$\S+)*\n', string)
							if quotes_search_cut:
								continue
							quotes_search_cut_left = re.search('"(.*)"\t"(.*)"\t"(.*)"', string)
							quotes_search_cut_left1 = re.search('(.*)"\t"(.*)"\t"(.*)"', string)
							if quotes_search_cut_left:
								quotes_search = quotes_search_cut_left
							elif quotes_search_cut_left1:
								quotes_search = quotes_search_cut_left
					except re.error:
						quotes_search = re.search('(.*)\t(.*)\t(.*)', string)

					if quotes_search:
						if quotes_search.groups() not in search_match_list:
							search_match_list.append(quotes_search.groups())
						descr = quotes_search.group(1)
						macro_name = quotes_search.group(2)
						say = quotes_search.group(3)

					new_lines_search = re.search('/n', say)
					if new_lines_search:
						say = re.sub('/n', '\n\t\t', say)

				for i in search_match_list:
					descr = re.sub('"', '', i[0])
					macro_name = re.sub('"', '', i[1])
					say = re.sub('"', '', i[2])
					say = re.sub('\/n', '\n\t\t', say)
					work_string += '##' + descr + '\n#macro(' + macro_name + ')\n\t#random()\n\t\t' + say + '\n\t#end\n#end\n\n'

				zf_create = zipfile.ZipFile(zipdata, mode='a')
				work_string = re.sub('""', '"', work_string)
				try:
					if path_name:
						zf_create.writestr(str(path_name.group(1)) + str(path_name.group(2))[0:-4] + '.vm', work_string)
					else:
						zf_create.writestr(str(path.group(0))[0:-4] + '.vm', work_string)
				finally:
					work_string = ''
					search_match_list = []
					zf_create.close()

			response = HttpResponse(zipdata.getvalue(), content_type="application/x-zip-compressed")
			response['Content-Disposition'] = 'attachment; filename=assistant-linguistics_vm.zip'
			return response
		return HttpResponseRedirect('/upload_crowdin/')


def upload(request):
	if request.method == "POST":
		form = UploadFileForm(request.POST, request.FILES)
		if form.is_valid():
			input_file = request.FILES.get('file')
			rb = xlrd.open_workbook(file_contents=input_file.read())
			sheet = rb.sheet_by_index(0)
			row = sheet.row_values(0)
			service_column = sheet.col_values(row.index('service'))
			action_column = sheet.col_values(row.index('action'))
			input_column = sheet.col_values(row.index('input'))
			data_column = sheet.col_values(row.index('data'))
			table_len = len(input_column)
			service_cell = sheet.cell_value(1, row.index('service'))
			action_cell = sheet.cell_value(1, row.index('action'))
			input_cell = sheet.cell_value(1, row.index('input'))
			data_cell = sheet.cell_value(1, row.index('data'))
			for i in range(1, table_len):
				service_get = sheet.cell_value(i, row.index('service'))
				action_get = sheet.cell_value(i, row.index('action'))
				object_get = sheet.cell_value(i, row.index('data'))
				input_get = sheet.cell_value(i, row.index('input'))
				b = InputsModelExtended(service=service_get.capitalize(), action=action_get, object=object_get,
				                        input=input_get)
				if not InputsModelExtended.objects.filter(input=input_get).exists() and input_get != '':
					action = service_get
					input = input_get
					input_form_send_mail(action, input)
					b.save()
		return HttpResponseRedirect('/')
	else:
		form = UploadFileForm()
	return render_to_response('inputs_upload_form.html', {'form': form, 'test': 'empty'},
	                          context_instance=RequestContext(request))


# @retry(Exception, tries=4)
def meta(request):
	if request.user.is_authenticated():
		if request.method == "POST":
			wiki_form = WikiListCreateForm(request.POST)
			meta_form = MetaCreateForm(request.POST)
			if meta_form.is_valid():
				meta_name = request.POST['meta_name']
				language = request.POST['language']
				meta_split = meta_name.split('-')
				type_request = meta_split[-1]
				meta_name = '-'.join(map(str, meta_split[:-1]))
				file_path = meta_name + "-" + type_request + '.meta'
				if meta_name.endswith("s"):
					text = '<meta name="meta.' + meta_name + '-' + type_request + '\" lang=\"' + language + '\">\n\n<pattern>' + meta_name + '</pattern>\n\n</meta>'
				else:
					text = '<meta name="meta.' + meta_name + '-' + type_request + '\" lang=\"' + language + '\">\n\n<pattern>' + meta_name + '</pattern>\n<pattern>' + meta_name + 's' + '</pattern>\n\n</meta>'
				response = HttpResponse(content_type='application/force-download')
				response['Content-Disposition'] = 'attachment; filename=' + file_path
				response.write(text)
				return response
			elif wiki_form.is_valid():
				item_list = []
				del item_list[:]
				subcat_list = []
				site = request.POST['site_name']
				page = urllib2.urlopen(site)
				soup = BeautifulSoup(page)
				for headline in soup.select('h1#firstHeading'):
					match_List = re.match('[Ll]ist(s*).*', headline.text)
					match_Category = re.match('[Cc]ategory(s*).*', headline.text)
					if match_List:
						if soup('table', {'class': 'multicol'}):
							for headline in soup('table', {'class': 'multicol'}):
								try:
									links = headline.find_next('tr').find_all('td')
									for link in links:
										linkk = link.find_next('ul').find_all('a')
										for linkkk in linkk:
											match = re.match('\[\d+\]', str(linkkk.text.encode('utf-8')))
											list_match = re.match('[Ll]ist(s*)', str(linkkk.text.encode('utf-8')))
											if not match and not list_match:
												if linkkk.text:
													singer_1st = re.sub('\s\(.*\)', '', linkkk.text)
													singer_1st = re.sub(',', '', linkkk.text)
													singer_1st = re.sub('\(', '', singer_1st)
													singer_1st = re.sub('\)', '', singer_1st)
													singer_1st = re.sub('"', '', singer_1st)
													singer_1st = re.sub('&', 'and', singer_1st)
													singer_1st = re.sub('-', ' ', singer_1st)
													item_list.append(singer_1st)
								except AttributeError:
									pass
						elif soup('div', {'class': 'div-col columns column-width'}):
							ref_div = 'div class="reflist references-column-width"'
							for headline in soup('div', {'class': 'div-col columns column-width'}):
								if ref_div not in str(headline):
									link = headline.find_all('a')
									for linkk in link:
										match_List = re.search('[Ll]ist(s*).*', linkk.text)
										if not match_List:
											num_match = re.match('\[\d+\]', linkk.text)
											cit_match = re.match('\[citation needed\]', linkk.text)
											if not num_match and not cit_match:
												if linkk.text:
													singer_2nd = re.sub('\s\(.*\)', '', linkk.text)
													singer_2nd = re.sub(',', '', singer_2nd)
													singer_2nd = re.sub('\(', '', singer_2nd)
													singer_2nd = re.sub('\)', '', singer_2nd)
													singer_2nd = re.sub('"', '', singer_2nd)
													singer_2nd = re.sub('\[\d+\]', '', singer_2nd)
													singer_2nd = re.sub('\[citation needed\]', '', singer_2nd)
													singer_2nd = re.sub('-', ' ', singer_2nd)
													singer_2nd = re.sub('&', 'and', singer_2nd)
													item_list.append(linkk.text)
						elif soup.find("table", {"class": "wikitable sortable"}) or soup.find("table",
						                                                                      {"class": "wikitable"}):
							if soup.find("table", {"class": "wikitable sortable"}):
								table = soup.find_all("table", {"class": "wikitable sortable"})
								for roww in table:
									row_set = roww.findAll("tr")
									for row in row_set:
										row_cells_set = row.findAll("td")
										if row_cells_set:
											if row_cells_set[0].text:
												match_num = re.match('\[\d+\]', row_cells_set[0].text)
												match_num_col = re.match('^\d{1,3}$', row_cells_set[0].text)
												if not match_num:
													if not match_num_col:
														item = row_cells_set[0].text
													else:
														item = row_cells_set[1].text
													match_num_cell = re.match('\[\d+\]', item)
													if not match_num_cell:
														singerr = re.sub(',', '', item)
														singerr = re.sub('\s\(.*\)', '', singerr)
														singerr = re.sub('\s*\[.*\]', '', singerr)
														singerr = re.sub('-', '', singerr)
														singerr = re.sub(',', '', singerr)
														singerr = re.sub('\.', '', singerr)
														singerr = re.sub(':', '', singerr)
														singerr = re.sub('\'', ' ', singerr)
														singerr = re.sub('\[\d+\]', '', singerr)
														singerr = re.sub('\[.*\]', '', singerr)
														singerr = re.sub('"', ' ', singerr)
														singerr = re.sub('&', 'and', singerr)
														singerr = re.sub('-', ' ', singerr)
														split = singerr.split(" ")
														if len(split) == 3:
															try:
																rep = split[1]
																rep_len = len(split[1])
																rep_index = rep_len
																if rep[0:rep_index / 2] == rep[rep_index / 2:rep_index]:
																	if split[2]:
																		singerr = rep[rep_index / 2:rep_index] + ' ' + \
																		          split[2]
															except IndexError:
																pass
														elif len(split) == 5:
															try:
																middle = split[2]
																sur = middle[0:len(split[3])]
																name = middle[len(split[3]):]
																if sur == split[3] and name == split[1]:
																	if split[2]:
																		singerr = split[1] + ' ' + split[3] + ' ' + \
																		          split[4]
															except IndexError:
																pass
														elif len(split) == 7:
															try:
																middle = split[3]
																sur = middle[0:len(split[5])]
																name = middle[len(split[5]):]
																if sur == split[5] and name == split[1]:
																	if split[3]:
																		singerr = split[2] + ' ' + split[3] + ' ' + \
																		          split[4] + ' ' + split[1]
															except IndexError:
																pass
														# if singerr not in item_list and not lists_match:
														if singerr not in item_list:
															item_list.append(singerr)
							elif soup.find("table", {"class": "wikitable"}):
								table = soup.findAll("table", {"class": "wikitable"})
								for table in table:
									row_set = table.findAll("tr")
									for row in row_set:
										row_cells_set = row.findAll("td")
										if row_cells_set:
											if row_cells_set[0].text:
												match_num = re.match('\[\d+\]', row_cells_set[0].text)
												match_num_col = re.match('^\d{1,3}$', row_cells_set[0].text)
												if not match_num:
													if not match_num_col:
														item = row_cells_set[0].text
													else:
														item = row_cells_set[1].text
													match_num_cell = re.match('\[\d+\]', item)
													if not match_num_cell:
														link_replace = re.sub('\[\d+\]', '', item)
														link_replace = re.sub('\s\(.*\)', '', link_replace)
														link_replace = re.sub(',', '', link_replace)
														link_replace = re.sub('\(', '', link_replace)
														link_replace = re.sub('\)', '', link_replace)
														link_replace = re.sub('"', '', link_replace)
														link_replace = re.sub('\.', '', link_replace)
														link_replace = re.sub('&', 'and', link_replace)
														link_replace = re.sub('\xa0', '', link_replace)
														link_replace = re.sub('-', ' ', link_replace)
														# if link_replace not in item_list:
														if link_replace.startswith(' '.decode('utf-8')):
															item_list.append(link_replace[1:])
														else:
															item_list.append(link_replace)
							elif soup('table', {'class': 'wikitable sortable plainrowheaders'}):
								table = soup.find('table', {'class': 'wikitable sortable plainrowheaders'})
								row_set = table.findAll("tr")
								for row in row_set:
									row_cells_set = row.findAll("td")
									if row_cells_set:
										match_num = re.match('\[\d+\]', row_cells_set[0].text)
										if not match_num:
											if row_cells_set[0].text:
												sortkey_span = row_cells_set[0].findAll("span", {"class": "sorttext"})
												for text in sortkey_span:
													singerr = re.sub('\s\(.*\)', '', text.text)
													singerr = re.sub('\s*\[.*\]', '', singerr)
													if singerr not in item_list:
														item_list.append(singerr)
						elif soup('div', {'class': 'div-col columns column-count column-count-3'}):
							for headline in soup('div', {'class': 'div-col columns column-count column-count-3'}):
								link = headline.find_next('ul').find_all('li')
								for para_link in link:
									if para_link:
										match_num = re.match('\[\d+\]', para_link.text)
										if not match_num:
											if para_link.text:
												link_replace = re.sub('\[\d+\]', '', para_link.text)
												link_replace = re.sub('\s\(.*\)', '', link_replace)
												link_replace = re.sub(',', '', link_replace)
												link_replace = re.sub('\(', '', link_replace)
												link_replace = re.sub('\)', '', link_replace)
												link_replace = re.sub('"', '', link_replace)
												link_replace = re.sub('&', 'and', link_replace)
												link_replace = re.sub('\xa0', '', link_replace)
												link_replace = re.sub('-', ' ', link_replace)
												if link_replace not in item_list:
													item_list.append(link_replace)
						else:
							try:
								references = '<span class="mw-headline" id="References">References</span>'
								sources = '<span class="mw-headline" id="Sources">Sources</span>'
								see_also = '<span class="mw-headline" id="See_also">See also</span>'
								notes = '<span class="mw-headline" id="Notes">Notes</span>'
								footnotes = '<span class="mw-headline" id="Footnotes">Footnotes</span>'
								external_links = '<span class="mw-headline" id="External_links">External links</span>'
								notes_and_references = '<span class="mw-headline" id="Notes_and_references">Notes and references</span>'
								para = soup.find('p').find_next('ul').find_all('a')
								for para_link in para:
									list_match = re.match('[Ll]ist(s*).*', para_link.text)
									wiki_match = re.search('wiki', para_link['href'])
									if wiki_match and list_match:
										list_link_text = 'https://en.wikipedia.org' + para_link['href']
										if list_link_text not in subcat_list:
											redlink_match = re.search('redlink', list_link_text)
											dots_match = re.search('[#:]', para_link['href'])
											if not redlink_match and not dots_match:
												subcat_list.append(list_link_text)
											# print 'list added to subcat_list: ' + list_link_text
									else:
										singer_text = re.sub('\s\(.*\)', '', para_link.text)
										singer_text = re.sub(',', '', singer_text)
										singer_text = re.sub('\(', '', singer_text)
										singer_text = re.sub('\)', '', singer_text)
										singer_text = re.sub('"', '', singer_text)
										singer_text = re.sub('&', 'and', singer_text)
										singer_text = re.sub('-', ' ', singer_text)
										if singer_text not in item_list:
											item_list.append(singer_text)
								for headline in soup('span', {'class': 'mw-headline'}):
									if str(headline) != references and str(headline) != notes_and_references and str(
											headline) != sources and str(headline) != see_also and str(
											headline) != notes and str(headline) != footnotes and str(
											headline) != external_links:
										links = headline.find_next('ul').find_all('a')
										for link in links:
											if link.text not in item_list:
												match = re.match('[Ll]ist(s*).*', link.text)
												match_num = re.match('\[\d+\]', link.text)
												match_alphabet = re.match('^[a-zA-Z0-9]{1}$', link.text)
												if match:
													http_match = re.search('http:', link['href'])
													wiki_match = re.search('wiki', link['href'])
													if wiki_match:
														if not http_match:
															list_link_text = 'https://en.wikipedia.org' + link['href']
														elif http_match:
															list_link_text = 'http://en.wikipedia.org' + link['href']
														# if not link_filter_people or not link_filter_actor or not link_filter_work or not link_filter_film or not link_filter_book or not link_filter_men or not link_filter_comedian or not link_filter_writer or not link_filter_actor or not link_filter_actress or not link_filter_idols or not link_filter_celebs or not link_filter_songs:
														res = False
														if list_link_text not in subcat_list:
															redlink_match = re.search('redlink', list_link_text)
															dots_match = re.search('[#:]', link['href'])
															if not redlink_match and not dots_match:
																subcat_list.append(list_link_text)
															# uncomment to check added subcat
															# print 'list added to subcat_list: ' + list_link_text
									if str(headline) != references and str(headline) != notes_and_references and str(
											headline) != sources and str(headline) != notes and str(
											headline) != footnotes and str(headline) != external_links:
										links = headline.find_next('ul').find_all('li')
										for link in links:
											linkss = link.find_all('a')
											if linkss:
												try:
													if linkss[0].text not in item_list:
														match = re.match('[Ll]ist(s*).*', linkss[0].text)
														list_in_link = re.search('[Ll]ist(s*).*', linkss[0]['href'])
														redlink_list_in_link = re.search('redlink', linkss[0]['href'])
														match_num = re.match('\[\d+\]', linkss[0].text)
														match_alphabet = re.match('^[a-zA-Z0-9]{1}$', linkss[0].text)
														http_match = re.search('http:', linkss[0]['href'])
														wiki_in_link = re.match('http[s*]://en.wikipedia',
														                        linkss[0]['href'])
														if not match_num and not match_alphabet and not match and not list_in_link:
															if link.text not in item_list:
																singer_text = re.sub('\s\(.*\)', '', linkss[0].text)
																singer_text = re.sub(',', '', singer_text)
																singer_text = re.sub('\(', '', singer_text)
																singer_text = re.sub('\)', '', singer_text)
																singer_text = re.sub('"', '', singer_text)
																singer_text = re.sub('&', 'and', singer_text)
																singer_text = re.sub('-', ' ', singer_text)
																if singer_text not in item_list:
																	item_list.append(singer_text)
																wiki_match = re.search('wiki', linkss[0]['href'])
														if list_in_link and match and not redlink_list_in_link:
															if wiki_match:
																if http_match:
																	list_link_textt = 'http://en.wikipedia.org' + \
																	                  linkss[0]['href']
																elif not http_match:
																	list_link_textt = 'https://en.wikipedia.org' + \
																	                  linkss[0]['href']
																# list_link_textt = 'https://en.wikipedia.org' + linkss[0]['href']
																if list_link_textt not in subcat_list:
																	redlink_match = re.search('redlink',
																	                          list_link_textt)
																	dots_match = re.search('[#:]', linkss[0]['href'])
																	if not redlink_match and not dots_match:
																		subcat_list.append(list_link_textt)
												except KeyError:
													pass
							except AttributeError:
								pass
					else:
						if match_Category:
							if soup.select('div#mw-pages'):
								for headline in soup.select('div#mw-pages'):
									links = headline.find_all('a')
									for link in links:
										link_replace = re.sub('\s\(.*\)', '', link.text)
										link_replace = re.sub('Template:', '', link_replace)
										link_replace = re.sub(',', '', link_replace)
										link_replace = re.sub('\(', '', link_replace)
										link_replace = re.sub('\)', '', link_replace)
										link_replace = re.sub('"', '', link_replace)
										link_replace = re.sub('-', ' ', link_replace)
										link_replace = re.sub('&', 'and', link_replace)
										link_match = re.match('learn more', link_replace)
										list_match = re.match('[Ll]ist(s*).*', link_replace)
										next_match = re.match('next page', link_replace)
										wiki_match = re.search('wiki', link['href'])
										# processing pages list
										if not link_match and not list_match and not next_match:
											# if not link_match and not list_match and not next_match:
											# if link_replace not in item_list:
											item_list.append(link_replace)
										if list_match:
											if wiki_match:
												# adding pages with list to main list
												list_link_text = 'https://en.wikipedia.org' + link['href']
												if list_link_text not in subcat_list:
													redlink_match = re.search('redlink', list_link_text)
													if not redlink_match:
														subcat_list.append(list_link_text)
														print 'list found in pages in category: ' + list_link_text
													# print 'overall pages quantity ' + str(len(links))
							elif soup.select('div#mw-subcategories'):
								for headline in soup.select('div#mw-subcategories'):
									links = headline.find_all('a')
									for link in links:
										wiki_match = re.search('wiki', link['href'])
										if wiki_match:
											link_text = 'https://en.wikipedia.org' + link['href']
											# adding pages with subcategories to main list
											if link_text not in subcat_list:
												redlink_match = re.search('redlink', link_text)
												if not redlink_match:
													subcat_list.append(link_text)
													print 'category added: ' + link_text
						else:
							if soup.select('span.mw-headline'):
								for headline in soup.select('p'):
									try:
										links = headline.find_next('ul').find_all('li')
										for link in links:
											linkss = link.find_all('i')
											for i in linkss:
												link_replace = re.sub('\s\(.*\)', '', i.text)
												link_replace = re.sub('Template:', '', link_replace)
												link_replace = re.sub(',', '', link_replace)
												link_replace = re.sub('\(', '', link_replace)
												link_replace = re.sub('\)', '', link_replace)
												link_replace = re.sub('"', '', link_replace)
												link_replace = re.sub('&', 'and', link_replace)
												link_replace = re.sub('-', ' ', link_replace)
												link_match = re.match('learn more', link_replace)
												list_match = re.match('[Ll]ist(s*).*', link_replace)
												next_match = re.match('next page', link_replace)
												try:
													wiki_match = re.search('wiki', i['href'])
												except KeyError:
													pass
												if not link_match and not list_match and not next_match:
													if link_replace not in item_list:
														item_list.append(link_replace)
												if list_match:
													if wiki_match:
														try:
															list_link_text = 'https://en.wikipedia.org' + link['href']
														except KeyError:
															pass
														if list_link_text not in subcat_list:
															redlink_match = re.search('redlink', list_link_text)
															if not redlink_match:
																subcat_list.append(list_link_text)
									except AttributeError:
										pass
				if re.search('https', site):
					file_name = site[38:]
				else:
					file_name = site[37:]
				meta_open_name = re.sub('_', '-', file_name) + '-wiki-list.meta'
				language = request.POST['language']
				text = '<meta name="meta.' + meta_open_name[
				                             :-15] + '-wiki-list\" lang=\"' + language + '\">' '\n \n<pattern>' + '</pattern>\n<pattern>'.join(
					item_list) + '</pattern>' '\n \n </meta>'
				response = HttpResponse(content_type='application/force-download')
				response['Content-Disposition'] = 'attachment; filename=' + meta_open_name.lower()
				response.write(text)
				return response
		form = MetaCreateForm()
		wiki_form = WikiListCreateForm()
		return render(request, 'meta.html', {'form': form, 'wiki_form': wiki_form})
	else:
		return redirect('login')


def crowdin_download(request):
	os.system("crowdin-cli -c crowdin_en.yaml download")
	return HttpResponseRedirect('/upload_crowdin/')


def vm_to_csv_upload(request):
	end = '#end'
	tab = '\t'
	double_tab = '\t\t'
	randomm = '#random\(\)'
	macro_name = '#macro\((.*)\)'
	new_stroke = '^\n$'
	descr = '##(.*)'

	work_string = ''
	rec = False
	rec_init = False
	first_run_check = True
	first_input_check = False
	descr_found = False
	one_string_macro = False

	if request.method == "POST":
		input_file = request.FILES.get('file_vm')

		if input_file:
			for string in input_file:

				tab_match = re.search(tab, string)
				if tab_match:
					string = re.sub(tab, '', string)
					string = re.sub('	', '', string)

				tab_spaces_match = re.search('		', string)
				if tab_spaces_match:
					string = re.sub('		', '', string)

				random = re.search(randomm, string)
				if random:
					string = re.sub(randomm, '', string)

				double_tab_match = re.search(tab, string)
				if double_tab_match:
					string = re.sub(double_tab, '', string)

				end_match = re.search(end, string)
				if end_match:
					string = re.sub(end, '', string)

				new_stroke = (new_stroke, string)
				r_search = ('\r', string)
				if new_stroke:
					string = re.sub('^\n$', '', string)
				if r_search:
					string = re.sub('\r', '', string)

				descr = re.search('^##\s*(.*)', string)
				if descr:
					first_input_check = True
					description = descr.group(1)
					if len(description) > 0:
						descr_found = True
					if re.search('".+"', description):
						description = re.sub('"', '""', description)
						description = '"' + description + '"'
					if rec == False:
						rec = True
					else:
						rec = False

				macro_name = re.search('#macro\((.*)\)', string)
				if macro_name:
					li_search_macro_name = re.search('#li\(', macro_name.group(1))
					if li_search_macro_name:
						macro_name = re.search('#macro\((.*)\)\s*[#]', string)
					else:
						macro_name = re.search('#macro\((.*)\)', string)
					# print macro_name.group(1)
					args_search = re.search('\$[a-zA-Z]+', macro_name.group(1))
					if not args_search:
						first_input_check = True
						li_search = re.search('#li\(\)', string)
						macro_end_stroke = re.search('#macro\((.*)\)$', string)
						if not li_search and macro_end_stroke:
							string = re.sub('#macro\((.*)\)', macro_name.group(1), string)

							new_stroke_end = re.search('\n$', string)
							if new_stroke_end:
								string = re.sub('\n$', '', string)

							macro_name_string = string
						else:
							one_string_macro = True
							li_input = re.search('#li\(\)\s*(.*)', string)
							if li_input:
								li_inputt = li_input.group(1)
								li_inputt = re.sub('\s{2,3}', '', li_inputt)
								input_string = "#li() " + li_inputt + " #end"
							else:
								macro_end_end = re.search('#macro\(.*\)(.*)', string)
								if macro_end_end:
									input_string = macro_end_end.group(1)

							# print string
							# string = re.sub('#li\(\)', '', string)

							# macro_name = re.search('#macro\((.*)\)', string)
							# macro_name = macro_name.group(1)
							string = macro_name.group(1)

							new_stroke_end = re.search('\n$', string)
							if new_stroke_end:
								string = re.sub('\n$', '', string)

							macro_name_string = string
					else:
						macro_end_stroke = re.search('#macro\((.*)\)$', string)
						##if macro_end_stroke:
						if not macro_end_stroke:
							one_string_macro = True
						first_input_check = True
						li_search = re.search('#li\(\)', string)
						li_string_search = re.search('#li\(\)(.+)', string)
						if li_search:
							macro_name_li = re.search('#macro\((.*)\)#li\(\)', string)
							string = macro_name_li.group(1)
							macro_name_string = string
							if li_string_search:
								input_string = li_string_search.group(1)
						else:
							string = re.sub('#macro\((.*)\)', macro_name.group(1), string)

							new_stroke_end = re.search('\n$', string)
							if new_stroke_end:
								string = re.sub('\n$', '', string)

							input_string = ''
							macro_name_string = string

				if not macro_name and not descr:
					new_stroke_end = re.search('\n$', string)
					if new_stroke_end:
						string = re.sub('\n$', '', string)
					double_qoute = re.search('"', string)
					if double_qoute:
						string = re.sub('"', '\'', string)
					if new_stroke_end:
						string = re.sub('\n$', '', string)
					string = re.sub('^   ', '', string)
					input = string
					descr_found = False
					string_li_search = re.search('#li\(', string)
					if string_li_search:
						string = string + '#end'

				space_seacrh = re.search('^\s{2,5}', string)

				if rec == True:
					if descr and len(description) > 0:
						first_input_check = True
						if first_run_check == True:
							work_string += description + '\t'
							first_run_check = False
						else:
							work_string += '\n' + description + '\t'
					elif macro_name:
						if one_string_macro != True:
							if descr_found == True:
								work_string += macro_name_string + '\t'
							elif descr_found == False:
								if first_run_check == True:
									work_string += 'no description\t' + macro_name_string + '\t'
									first_run_check = False
								else:
									work_string += '\nno description\t' + macro_name_string + '\t'
						else:
							if descr_found == True:
								if len(input_string) > 0:
									try:
										work_string += macro_name_string + '\t' + input_string
									except UnboundLocalError:
										work_string += macro_name_string + '\t'
								else:
									work_string += macro_name_string + '\t'
							elif descr_found == False:
								if len(input_string) > 0:
									try:
										work_string += '\nno description\t' + macro_name_string + '\t' + input_string
									except UnboundLocalError:
										work_string += '\nno description\t' + macro_name_string + '\t'
								else:
									work_string += '\nno description\t' + macro_name_string + '\t'
							one_string_macro = False
					elif not macro_name and not descr and len(string) > 0 and not space_seacrh:
						if first_input_check == True:
							work_string += string
							first_input_check = False
						elif first_input_check == False:
							if string != ' ':
								work_string += '/n' + string  # repeat.vm
							else:
								work_string += string

				if rec == False:
					if descr and len(description) > 0:
						first_input_check = True
						work_string += '\n' + description + '\t'
					elif macro_name:
						if one_string_macro != True:
							if descr_found == True:
								work_string += macro_name_string + '\t'
							elif descr_found == False:
								if first_run_check == True:
									work_string += 'no description\t' + macro_name_string + '\t'
									first_run_check = False
								else:
									work_string += '\nno description\t' + macro_name_string + '\t'
								# one_string_macro = False
						else:
							if descr_found == True:
								if len(input_string) > 0:
									try:
										work_string += macro_name_string + '\t' + input_string
									except UnboundLocalError:
										work_string += macro_name_string + '\t'
								else:
									work_string += macro_name_string + '\t'
							elif descr_found == False:
								if len(input_string) > 0:
									try:
										work_string += '\nno description\t' + macro_name_string + '\t' + input_string
									except UnboundLocalError:
										work_string += '\nno description\t' + macro_name_string + '\t'
								else:
									work_string += '\nno description\t' + macro_name_string + '\t'
							one_string_macro = False
					elif not macro_name and not descr and len(string) > 0 and not space_seacrh:
						if first_input_check == True:
							work_string += string
							first_input_check = False
						elif first_input_check == False:
							if string != ' ':
								work_string += '/n' + string  # repeat.vm
							else:
								work_string += string

				description = ''
				macro_name = ''
				string = ''
				input_string = ''
			# writer.writerow(work_string)
			work_string = re.sub('\r', '', work_string)
			work_string = re.sub('   ', '', work_string)
			work_string = re.sub('\t\s', '\t', work_string)
			work_string = re.sub('\t/n', '\t', work_string)
			work_string = re.sub('\t$', '', work_string)
			work_string = re.sub('/n\s$', '', work_string)
			work_string = re.sub('/n$', '', work_string)
			file_name = request.FILES['file_vm'].name[:-3] + '.csv'

			br_work_string = re.sub('\\n', '<br>', work_string)
			page_text = 'Here\'s what gonna be uploaded to crowdin:<br><br><br>' + br_work_string + '<br><br><br>Is that okay?'
			return render(request, 'crowdin_upload_check.html',
			              {'page_text': page_text, 'csv_text': work_string, 'file_name': file_name})
		return HttpResponseRedirect('/upload_crowdin/')


def crowdin_approve(request):
	req = urllib2.Request(assistant_linguistics_english_info)
	resp = urllib2.urlopen(req)
	content = resp.read()

	path = ''
	dir_found = False

	name = ''

	dir = ''
	dir1 = ''
	dir2 = ''

	files_list = []

	root = ET.fromstring(content)
	for file in root.findall('files'):
		for item in file.findall('item'):
			if item.find('node_type').text == 'directory':
				dir += item.find('name').text + '/'
			else:
				name = item.find('name').text
			path = name
			csv_found = re.search('\.csv', path)
			if csv_found:
				files_list.append(path)
			for elem in item.findall('files'):
				for elemm in elem.findall('item'):
					if elemm.find('node_type').text == 'directory':
						dir1 = dir + elemm.find('name').text + '/'
					else:
						name = elemm.find('name').text
					path = dir + name
					csv_found = re.search('\.csv', path)
					if csv_found:
						files_list.append(path)
					for elemmm in elemm.findall('files'):
						for elemmmm in elemmm.findall('item'):
							if elemmmm.find('node_type').text == 'directory':
								dir2 = dir1 + elemmmm.find('name').text + '/'
							else:
								name = elemmmm.find('name').text
							path = dir1 + name
							csv_found = re.search('\.csv', path)
							if csv_found:
								files_list.append(path)
							for elemmmmm in elemmmm.findall('files'):
								for elemmmmmm in elemmmmm.findall('item'):
									if elemmmmmm.find('node_type').text == 'directory':
										dir3 = dir2 + elemmmmmm.find('name').text + '/'
									else:
										name += elemmmmmm.find('name').text
									path = dir2 + name
									csv_found = re.search('\.csv', path)
									if csv_found:
										files_list.append(path)

			dir = ''
			name = ''

	if request.method == "POST":
		work_string = request.POST.get('csv_text', None)
		file_name = request.POST.get('file_name', None)

		if os.path.exists('crowdin_temp') == False:
			os.makedirs('crowdin_temp')
		with open('crowdin_temp/' + file_name, 'w') as f:
			f.write(work_string.encode('utf-8'))

		data = {'scheme': 'context, identifier, source_or_translation', 'type': 'csv'}
		files = {'files[' + file_name + ']': open('crowdin_temp/' + file_name, 'rb')}

		file_match = re.search(file_name, str(files_list))
		if not file_match:
			r = requests.post(assistant_linguistics_english_add, files=files, params=data)
		else:
			for file_se in files_list:
				if re.search('/', file_se):
					if re.search(file_name, file_se):
						files = {'files[' + file_se + ']': open('crowdin_temp/' + file_name, 'rb')}
						r = requests.post(assistant_linguistics_english_update, files=files, params=data)
				else:
					r = requests.post(assistant_linguistics_english_update, files=files, params=data)

		os.system("rm crowdin_temp/" + file_name)
		os.system("rmdir crowdin_temp")

		text = file_name + ' file was uploaded to crowdin'
		data = {"text": text, 'username': 'lingsite_bot', 'channel': '#linguists'}
		r = requests.post(hook, data=json.dumps(data))
		print r.text

		return HttpResponseRedirect('/upload_crowdin/')
	return HttpResponseRedirect('/upload_crowdin/')


def crowdin_upload(request):
	if request.method == "POST":
		crowdin_file_form = CrowdinReloadFileForm(request.POST)
		if crowdin_file_form.is_valid():
			file_name = request.POST['crowdin_file_name']
			files_list = subprocess.check_output('crowdin-cli -c crowdin_en_ryan.yaml list project', shell=True)
			file_match = re.search(file_name, str(files_list))
			if file_match:
				os.system("crowdin-cli -c crowdin_en_ryan.yaml download")
				for root, dirnames, filenames in os.walk('en-US'):
					for filename in fnmatch.filter(filenames, file_name):
						translation_path = os.path.join(root, filename)
						source_path = re.sub('en-US', '_en_source', translation_path)

				os.system('mv "' + source_path + '" "' + source_path[:-4] + '_backup.csv' + '"')
				os.system('rm -f ' + source_path)
				os.system('cp "' + translation_path + '" "' + source_path + '"')
				os.system("rm -rf en-US")
				os.system('rm -f "' + source_path[:-4] + '_backup.csv"')
				os.system("crowdin-cli -c crowdin_all_lang.yaml upload sources")
			else:
				files_list_re = re.sub('csv', 'csv<br>', files_list)
				return HttpResponse(
					'Here is list of files in crowdin Assistant Linguistics English project:<br><br>' + files_list_re + '<br><br>Please check your request is right')

		return HttpResponseRedirect('/upload_crowdin/')


def os_test(request):
	response = HttpResponse(content_type='application/force-download')
	if request.method == "POST":
		files_list = subprocess.check_output('crowdin-cli -c crowdin_en.yaml list project', shell=True)
		files_list_dict = files_list.split('\r\n')
		files_list_re = re.sub('csv', 'csv<br>', files_list)
		response.write(files_list_dict)
		response['Content-Disposition'] = 'attachment; filename=test.txt'
		return response


def move_crowdin(request):
	req = urllib2.Request(assistant_linguistics_info)
	resp = urllib2.urlopen(req)
	content = resp.read()

	path = ''
	dir_found = False

	name = ''

	dir = ''
	dir1 = ''
	dir2 = ''

	files_list = []

	root = ET.fromstring(content)
	for file in root.findall('files'):
		for item in file.findall('item'):
			if item.find('node_type').text == 'directory':
				dir += item.find('name').text + '/'
			else:
				name = item.find('name').text
			path = name
			csv_found = re.search('\.csv', path)
			if csv_found:
				files_list.append(path)
			for elem in item.findall('files'):
				for elemm in elem.findall('item'):
					if elemm.find('node_type').text == 'directory':
						dir1 = dir + elemm.find('name').text + '/'
					else:
						name = elemm.find('name').text
					path = dir + name
					csv_found = re.search('\.csv', path)
					if csv_found:
						files_list.append(path)
					for elemmm in elemm.findall('files'):
						for elemmmm in elemmm.findall('item'):
							if elemmmm.find('node_type').text == 'directory':
								dir2 = dir1 + elemmmm.find('name').text + '/'
							else:
								name = elemmmm.find('name').text
							path = dir1 + name
							csv_found = re.search('\.csv', path)
							if csv_found:
								files_list.append(path)
							for elemmmmm in elemmmm.findall('files'):
								for elemmmmmm in elemmmmm.findall('item'):
									if elemmmmmm.find('node_type').text == 'directory':
										dir3 = dir2 + elemmmmmm.find('name').text + '/'
									else:
										name += elemmmmmm.find('name').text
									path = dir2 + name
									csv_found = re.search('\.csv', path)
									if csv_found:
										files_list.append(path)

			dir = ''
			name = ''

	dirr = ''
	file_name = request.GET['file_name']
	if file_name is not None:
		try:
			file_search = re.search('^(.*)/(.+\.csv)$', file_name)
			ppath = file_search.group(1)
			ffile = file_search.group(2)
		except AttributeError:
			file_search = re.search('^(.+\.csv)$', file_name)
			ffile = file_search.group(1)

		r = requests.post(move_crowdin_post_url)
		b = urllib2.urlopen(move_crowdin_url)
		archive_path = '/tmp/crowdin.zip'

		with open(archive_path, 'wb')as f:
			f.write(b.read())

		zf = zipfile.ZipFile(archive_path)
		for name in zf.namelist():
			csv_search = re.search('.*\csv', name)
			if csv_search:
				s = re.search(ffile, name)
				if s:
					outpath = "/tmp/zip_test"
					zf.extract(name, outpath)

		data = {'scheme': 'context, identifier, source_or_translation', 'type': 'csv'}

		try:
			archive_file_path = outpath + '/en-US/' + ppath + '/' + ffile
			path_list = ppath.split('/')
			for dir in path_list:
				dirr = dirr + '/' + dir
				r = requests.post(move_crowdin_addir_url + dirr)
			files = {'files[' + ppath + '/' + ffile + ']': open(archive_file_path, 'rb')}
		except NameError:
			archive_file_path = outpath + '/en-US/' + '/' + ffile
			files = {'files[' + ffile + ']': open(archive_file_path, 'rb')}

		file_match = re.search(ffile, str(files_list))
		if not file_match:
			r = requests.post(assistant_linguistics_add, files=files, params=data)
		else:
			r = requests.post(assistant_linguistics_update, files=files, params=data)

		os.system('rm -f crowdin.zip')
		os.system("rm -rf zip_test")

		text = ffile + ' file was moved to assistant-linguistics project'
		data = {"text": text, 'username': 'lingsite_bot', 'channel': '#linguists'}
		r = requests.post(hook, data=json.dumps(data))
		print r.text

		return HttpResponseRedirect('/upload_crowdin/')
	else:
		return HttpResponseRedirect('/upload_crowdin/')


def remove_crowdin(request):
	file_name = request.GET['file_name']
	if file_name is not None:
		file_search = re.search('^(.*)/(.+\.csv)$', file_name)
		try:
			path = file_search.group(1)
			file = file_search.group(2)

			data = urllib.urlencode({'file': file_name})
			req = urllib2.Request(assistant_linguistics_english_delete, data)
			resp = urllib2.urlopen(req)

			root_path = file_search.group(1).split('/')
			req = urllib2.Request(assistant_linguistics_english_delete_folder + root_path[0])
			resp = urllib2.urlopen(req)
		except AttributeError:
			file_search = re.search('^(.+\.csv)$', file_name)
			file = file_search.group(1)

			data = urllib.urlencode({'file': file_name})
			req = urllib2.Request(assistant_linguistics_english_delete, data)
			try:
				resp = urllib2.urlopen(req)
			except HTTPError:
				return HttpResponseRedirect('/upload_crowdin/')

		return HttpResponseRedirect('/upload_crowdin/')
	else:
		return HttpResponseRedirect('/upload_crowdin/')


def download_csv_archive(request):
	zipdata = StringIO()
	response = HttpResponse(content_type='application/force-download')

	work_string = ''
	if request.method == "POST":
		r = requests.post(crowdin_csv_archive)
		b = urllib2.urlopen(assistant_linguistics_download)
		archive_path = '/tmp/crowdin.zip'
		with open(archive_path, 'wb')as f:
			f.write(b.read())

		input_file = request.FILES.get('file_archive')

		zf = zipfile.ZipFile(archive_path)
		for info in zf.infolist():
			path = re.search('(.*\.csv)', info.filename)
			path_name = re.search('(.*/)(.*\.csv)', info.filename)
			if path_name:
				print info.filename
				for string in zf.open(info.filename):
					try:
						quotes_search = re.search('"(.*)"\t"(.*)"\t"(.*)"', string)
						if not quotes_search:
							quotes_search_cut = re.search('"\w+(\s\$\S+)*\n', string)
							if quotes_search_cut:
								continue
							quotes_search_cut_left = re.search('(.*)"\t"(.*)"\t"(.*)"', string)
							if quotes_search_cut_left:
								quotes_search = re.search('(.*)"\t"(.*)"\t"(.*)"', string)
					except re.error:
						quotes_search = re.search('(.*)\t(.*)\t(.*)', string)

					if quotes_search:
						descr = quotes_search.group(1)
						macro_name = quotes_search.group(2)
						say = quotes_search.group(3)

					new_lines_search = re.search('/n', say)
					if new_lines_search:
						say = re.sub('/n', '\n\t\t', say)

					work_string = work_string + '##' + descr + '\n#macro(' + macro_name + ')\n\t#random()\n\t\t' + say + '\n\t#end\n#end\n\n'
				zf_create = zipfile.ZipFile(zipdata, mode='a')
				work_string = re.sub('""', '"', work_string)
				try:
					if path_name:
						zf_create.writestr(str(path_name.group(1)) + str(path_name.group(2))[0:-4] + '.vm', work_string)
				finally:
					zf_create.close()
				work_string = ''
		response = HttpResponse(zipdata.getvalue(), content_type="application/x-zip-compressed")
		response['Content-Disposition'] = 'attachment; filename=assistant-linguistics_vm.zip'

		os.system('rm -f ' + archive_path)
		return response

	return HttpResponseRedirect('/upload_crowdin/')


@login_required(login_url='/login/')
def apiai_render(request):
	if request.user.is_authenticated():
		logr.debug(str(request.user.username) + ' main page')
		print request.user
		print request.user.get_full_name
		return render(request, "apiai.html")
	else:
		return redirect('login')


def apiai_intents_update_render(request):
	if request.user.is_authenticated():
		logr.debug(str(request.user.username) + ' update page')
		return render(request, "apiai_update.html")
	else:
		return redirect('login')


@csrf_exempt
def apiai_ajax_link(request):
	if request.is_ajax() and request.method == 'POST':
		table = request.POST['htmlContent']
		b = PageTableModel(table=table)
		b.save()
		p_key = b.pk
		link = lingsite_test_id_url + str(p_key)
		url = '<a id="en_ling_project" href="' + str(link) + '" target="_blank">' + str(link) + '</a>'
		message = url
	else:
		message = "empty or not an ajax"
	return HttpResponse(message)


# return message

def apiai_ajax_link_id(request, test_id):
	table = PageTableModel.objects.get(pk=test_id)
	string = table.table.encode('utf-8')
	style = '<style>#result {font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;border-collapse: collapse;width: 80%;}#result td, #result th {border: 1px solid #ddd;text-align: left;padding: 5px;}#result tr:hover {background-color: #ddd;}#result th {padding-top: 5px;padding-bottom: 5px;background-color: #668cff;color: white;}#tr_bordered {background-color: #ddd;}</style>'
	html = '<!DOCTYPE html>\n<html>\n<head>' + style + '</head>\n<body>\n' + string + '\n</body></html>'
	return HttpResponse(html)


@csrf_exempt
def apiai_slack_bot(request):
	token = slack_token
	if request.method == 'POST':
		if request.POST['token'] == token:
			url = request.POST['response_url']
			text = request.POST['text']

			link = apiai_slack_bot_link(text)
			r = requests.get(link, headers=headers_apiai_slack_bot)
			textt = r.text
			data = json.loads(r.text)
			r_text = ''

			if data.get('result', {}).get('action'):
				r_text += data['result']['action'] + '\n'
			elif data.get('result', {}).get('metadata', {}).get('intentName'):
				r_text += data['result']['metadata']['intentName'] + '\n'

			if data.get('result', {}).get('metadata', {}).get('html'):
				r_text += data['result']['metadata']['html'] + '\n'

			if data.get('result', {}).get('parameters'):
				r_text += str(data['result']['parameters'])

			if len(r_text) > 0:
				payload = {"response_type": "in_channel", "text": text, "attachments": [{"text": r_text}]}
			else:
				payload = {"response_type": "in_channel", "text": text, "attachments": [{"text": textt}]}

			headers = {'content-type': 'application/json'}
			response = requests.post(url, data=json.dumps(payload), headers=headers)

			return HttpResponse(response)
	else:
		return HttpResponse('')


@csrf_exempt
def apiai_ajax_sql_link(request):
	def ResultIter(cursor, arraysize=10):
		'An iterator that uses fetchmany to keep memory usage down'
		while True:
			results = cursor.fetchmany(arraysize)
			if not results:
				break
			for result in results:
				yield result

	if request.is_ajax() and request.method == 'POST':
		parameters = request.POST['parameters']
		full_url = 'http://example.com/?' + parameters
		parsed = urlparse.urlparse(full_url)

		if urlparse.parse_qs(parsed.query).has_key('dialogs_quantity'):
			dialogs_quantity = urlparse.parse_qs(parsed.query)['dialogs_quantity'][0]
		else:
			dialogs_quantity = 0

		if urlparse.parse_qs(parsed.query).has_key('time_from'):
			time_from = urlparse.parse_qs(parsed.query)['time_from'][0]
		else:
			current_utc = strftime("%Y-%m-%d %H:%M:%S", gmtime())
			current_utc_strptime = datetime.strptime(current_utc, "%Y-%m-%d %H:%M:%S")
			current_utc_strptime -= timedelta(days=1)
			current_utc_strptime -= timedelta(hours=1)
			time_from = current_utc_strptime.strftime("%Y-%m-%dT%H:%M:%S")

		if urlparse.parse_qs(parsed.query).has_key('time_to'):
			time_to = urlparse.parse_qs(parsed.query)['time_to'][0]
		else:
			time_to = strftime("%Y-%m-%d %H:%M:%S", gmtime())

		if urlparse.parse_qs(parsed.query).has_key('dialogs_phrase_quantity_min'):
			dialogs_phrase_quantity_min = urlparse.parse_qs(parsed.query)['dialogs_phrase_quantity_min'][0]
		else:
			dialogs_phrase_quantity_min = 100

		if urlparse.parse_qs(parsed.query).has_key('dialogs_phrase_quantity_max'):
			dialogs_phrase_quantity_max = urlparse.parse_qs(parsed.query)['dialogs_phrase_quantity_max'][0]
		else:
			dialogs_phrase_quantity_max = dialogs_phrase_quantity_min

		if urlparse.parse_qs(parsed.query).has_key('keyPhrase'):
			keyPhrase = urlparse.parse_qs(parsed.query)['keyPhrase'][0].encode("utf-8")
		else:
			keyPhrase = ''

		# language = urlparse.parse_qs(parsed.query)['language'][0]
		language = request.POST['language']
		print request.POST['keyphrase'].encode('utf-8')

		conn = psycopg2.connect(dbname=spk_dbname, user=spk_user, host=spk_host, password=spk_pwd, port=int(spk_port))
		cur = conn.cursor()
		sql = "select user_id, user_input from events where lang=%s and created >= %s and created < %s order by user_id limit 100000;"
		data = (str(language), str(time_from), str(time_to),)
		print 'executing cursor..'
		print strftime("%H:%M:%S", gmtime())
		cur.execute(sql, data)
		print 'processing cursor data..'
		print strftime("%H:%M:%S", gmtime())
		d = {}
		# for x in cur.fetchall():
		for x in ResultIter(cur):
			if x[1].find('-') == -1 and x[1].find('assistantstart') == -1 and x[1].find('systemclient') == -1 and x[
				1].find('sys client') == -1 and x[1].find('assistantfirststart') == -1 and x[1].find(
					'system') == -1 and len(x[1]) > 0:
				d.setdefault(x[0], []).append(
					str(x[1]).decode('utf-8').replace(u'\u2019', "'").replace(u'\xf1', 'n').replace("\'", "'").replace(
						'BOT_NAME', 'Sam').encode("utf-8"))
		print 'dict done..'
		print strftime("%H:%M:%S", gmtime())
		dict_length = len(d)
		# print d.values()
		x = 0
		index = x
		req_index = x  # to begin from
		req = int(dialogs_quantity)  # requied number of output dialogs(0-all/0<req)
		if len(keyPhrase) > 0:
			# values_list = [re.sub('"', "'", str(elem)[1:-1]) for elem in d.values() if keyPhrase in str(elem[1:-1]) and not re.search('\\\\', str(elem[1:-1])) and (len(elem) > int(dialogs_phrase_quantity_min)-1 and len(elem) < int(dialogs_phrase_quantity_max)+1)]
			values_list = (elem for elem in d.values() if keyPhrase in str(elem[1:-1]) and (
			len(elem) > int(dialogs_phrase_quantity_min) - 1 and len(elem) < int(dialogs_phrase_quantity_max) + 1))
		else:
			# values_list = [re.sub('"', "'", str(elem)[1:-1]) for elem in d.values() if not re.search('\\\\', str(elem[1:-1])) and len(elem) > int(dialogs_phrase_quantity_min)-1 and len(elem) < int(dialogs_phrase_quantity_max)+1]
			# values_list = [str(elem)[1:-1].replace('"', "'").decode('utf-8') for elem in d.values() if len(elem) > int(dialogs_phrase_quantity_min)-1 and len(elem) < int(dialogs_phrase_quantity_max)+1]
			values_list = (elem for elem in d.values() if
			               len(elem) > int(dialogs_phrase_quantity_min) - 1 and len(elem) < int(
				               dialogs_phrase_quantity_max) + 1)
		message = ''
		result_dic = {}
		values_list = list(values_list)
		result_dic['match'] = values_list[0:int(dialogs_quantity)]
		result_dic['unmatch'] = values_list[int(dialogs_quantity):len(values_list)]
		if req > 0:
			quantity = int(len(result_dic['match'])) + int(len(result_dic['unmatch']))
			quantity_message = 'Found ' + str(quantity) + ' dialogs, showing ' + str(req) + '<br>'
		else:
			quantity_message = 'Found ' + str(len(values_list)) + ' dialogs<br>'
		cur.close()
		conn.close()
	if len(result_dic['match']) > 0:
		return HttpResponse(json.dumps(
			{'result_dic': result_dic, 'quantity_string': quantity_message, 'index': dialogs_quantity,
			 'quantity': len(list(values_list))}))
	else:
		return HttpResponse(json.dumps({'message': values_list, 'quantity_string': quantity_message, 'index': req_index,
		                                'quantity': len(list(values_list))}))


@csrf_exempt
def apiai_ajax_update(request):
	if request.is_ajax() and request.method == 'POST':
		parameters = request.POST.dict()['parameters'].encode('utf-8')
		url = request.POST.dict()['url']
		bearer = request.POST.dict()['bearer']
		headers = {'Authorization': bearer, 'Content-Type': 'application/json; charset=utf-8'}
		r = requests.put(url, headers=headers, data=parameters)
		status = json.loads(r.text)
		print parameters
	return HttpResponse(json.loads(r.text)['status']['code'])


@csrf_exempt
def apiai_ajax_update_diff(request):
	if request.is_ajax() and request.method == 'POST':
		parameters = request.POST.dict()['parameters'].encode('utf-8')
		url = request.POST.dict()['url']
		bearer = request.POST.dict()['bearer']
		headers = {'Authorization': bearer, 'Content-Type': 'application/json; charset=utf-8'}
		r = requests.put(url, headers=headers, data=json.loads(parameters))
		status = json.loads(r.text)
		print json.loads(parameters)
		print json.loads(r.text)
	return HttpResponse(json.loads(r.text)['status']['code'])


def apiai_stat_render(request):
	if request.user.is_authenticated():
		logr.debug(str(request.user.username) + ' stat page')
		return render(request, 'apiai_statistics.html')
	else:
		return redirect('login')


def apiai_doc_render(request):
	if request.user.is_authenticated():
		logr.debug(str(request.user.username) + ' stat page')
		return render(request, 'apiai_doc.html')
	else:
		return redirect('login')


@csrf_exempt
def apiai_stat_post(request):
	if request.user.is_authenticated():

		scope = ['https://spreadsheets.google.com/feeds']
		try:
			json_key = json.load(apiai_stat_key)
		except:
			json_key = apiai_stat_key
		# credentials = SignedJwtAssertionCredentials(apiai_stat_key['client_email'], apiai_stat_key['private_key'],scope)
		try:
			credentials = SignedJwtAssertionCredentials(apiai_stat_key['client_email'], apiai_stat_key['private_key'], scope)
		except:
			credentials = ServiceAccountCredentials.from_json_keyfile_dict(json_key, scope)
		gc = gspread.authorize(credentials)
		lang = json.loads(request.body)['lang']

		open_by_key_key = apiai_stat_post_openbykey(lang)
		wks = gc.open_by_key(open_by_key_key)

		if str(date.today().strftime('%d.%m.%y')) not in [i.title for i in wks.worksheets()]:
			worksheet = wks.add_worksheet(title=str(date.today().strftime('%d.%m.%y')), rows="2000", cols="20")

		worksheet = wks.get_worksheet(len(wks.worksheets()) - 1)
		worksheet.update_acell('A1', "Domains")
		worksheet.update_acell('B1', date.today().strftime('%d.%m.%y'))
		worksheet.update_acell('B2', "=sum(B3:B)")

		if request.is_ajax() and request.method == 'POST':

			count = json.loads(request.body)['count']
			id = json.loads(request.body)['id']
			lang = json.loads(request.body)['lang']

			dict_len = len(count) - 1
			cell_end = 'B' + str(3 + dict_len)

			cell_list_key_a = worksheet.range('A3:' + str('A' + str(3 + dict_len)))
			cell_list_key_b = worksheet.range('B3:' + str('B' + str(3 + dict_len)))

			x = 0
			for cell in cell_list_key_a:
				link = apiai_stat_intent_link(lang)
				url = link + str(id[count.items()[x][0]])
				cell.value = '=HYPERLINK("' + url + '","' + count.items()[x][0] + '")'
				x += 1

			x = 0
			for cell in cell_list_key_b:
				cell.value = count.items()[x][1]
				x += 1

			worksheet.update_cells(cell_list_key_a)
			worksheet.update_cells(cell_list_key_b)

		return HttpResponse('success')
	else:
		return redirect('login')


'''@csrf_exempt
def apiai_stat_post(request):
	if request.user.is_authenticated():

		scope = ['https://spreadsheets.google.com/feeds']
		credentials = SignedJwtAssertionCredentials(apiai_stat_key['client_email'], apiai_stat_key['private_key'], scope)
		gc = gspread.authorize(credentials)
		key = apiai_stat_post_openbykey('en')
		wks = gc.open_by_key(key)

		def col_coord(length):
			alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
			global col
			col = alphabet[length]

		all = wks.get_worksheet(0)

		by_intent = wks.get_worksheet(1)
		by_intent_val_list = [i for i in by_intent.row_values(1) if len(i) > 0]
		col_coord(len(by_intent_val_list))

		by_intent.update_acell(str(col) + str(1), date.today().strftime('%d.%m.%y'))

		if request.is_ajax() and request.method == 'POST':

			count = json.loads(request.body)['count']
			id = json.loads(request.body)['id']

			dict_len = len(count)-1
			cell_end = col + str(2 + dict_len)
			#cell_end = col + str(2 + len(by_intent.col_values(1)[1:]))
			range = str(str(col) + str(2))+':'+ str(cell_end)
			cell_list = by_intent.range(range)
			col_values_list = by_intent.col_values(1)[1:]
			print range
			print len(by_intent.col_values(1))

			for cell in cell_list:
				#cell_key = by_intent.cell(cell.row, 1).value
				cell_key = col_values_list[cell.row]
				#print cell_key
				#cell.value = count[cell_key]

			#by_intent.update_cells(cell_list)


		return HttpResponse('success')
	else:
		return redirect('login')'''


@csrf_exempt
def apiai_prod_ajax_sql_link(request):
	def ResultIter(cursor, arraysize=10):
		'An iterator that uses fetchmany to keep memory usage down'
		while True:
			results = cursor.fetchmany(arraysize)
			if not results:
				break
			for result in results:
				yield result

	if request.is_ajax() and request.method == 'POST':
		parameters = request.POST['parameters']
		agent = request.POST['agent']
		full_url = 'http://example.com/?' + parameters
		parsed = urlparse.urlparse(full_url)

		if urlparse.parse_qs(parsed.query).has_key('regexChk'):
			regexChk = True
			keyPhrase = request.POST['query']
		else:
			regexChk = False

		if urlparse.parse_qs(parsed.query).has_key('time_from'):
			time_from = urlparse.parse_qs(parsed.query)['time_from'][0]
		else:
			current_utc = strftime("%Y-%m-%d %H:%M:%S", gmtime())
			current_utc_strptime = datetime.strptime(current_utc, "%Y-%m-%d %H:%M:%S")
			current_utc_strptime -= timedelta(days=1)
			current_utc_strptime -= timedelta(hours=1)
			time_from = current_utc_strptime.strftime("%Y-%m-%dT%H:%M:%S")

		if urlparse.parse_qs(parsed.query).has_key('time_to'):
			time_to = urlparse.parse_qs(parsed.query)['time_to'][0]
		else:
			time_to = strftime("%Y-%m-%d %H:%M:%S", gmtime())

		if urlparse.parse_qs(parsed.query).has_key('keyPhrase'):
			keyPhrase = urlparse.parse_qs(parsed.query)['keyPhrase'][0].encode("utf-8")
			keyPhraseQuery = '% ' + keyPhrase + ' %'
			keyPhraseQuery_1 = '% ' + keyPhrase
			keyPhraseQuery_2 = keyPhrase + ' %'
			keyPhraseQuery_3 = keyPhrase

		else:
			keyPhrase = ''
			keyPhraseQuery = ''

		if urlparse.parse_qs(parsed.query).has_key('keyAction'):
			keyAction = urlparse.parse_qs(parsed.query)['keyAction'][0].encode("utf-8")
		else:
			keyAction = ''

		if urlparse.parse_qs(parsed.query).has_key('dialogs_quantity'):
			dialogs_quantity = urlparse.parse_qs(parsed.query)['dialogs_quantity'][0]
		else:
			dialogs_quantity = 0

		if urlparse.parse_qs(parsed.query).has_key('log_min_len'):
			log_len = urlparse.parse_qs(parsed.query)['log_min_len'][0]
		else:
			log_len = 0

		language = request.POST['language']
		global language_api_prod_from
		language_api_prod_from = language

		if agent != 'assistant_logs':
			conn = psycopg2.connect(dbname=apl_dbname, user=apl_user, host=apl_host, password=apl_pwd,
			                        port=int(apl_port))
			cur = conn.cursor()
			if keyPhraseQuery and len(keyPhraseQuery) > 0:
				if regexChk == False:
					sql = "select DISTINCT user_input, intent_name, source, user_action, user_input_details, featured_contexts, response from events where lang=%s and created >= %s and created < %s and agent_id=%s and (user_input like %s or user_input like %s or user_input like %s or user_input like %s) order by created desc limit 100000;"
				else:
					sql = "select DISTINCT user_input, intent_name, source, user_action, user_input_details, featured_contexts, response from events where lang=%s and created >= %s and created < %s and agent_id=%s and (user_input ~* %s or user_input ~* %s or user_input ~* %s or user_input ~* %s) order by created desc limit 100000;"
				data = (
				str(language), str(time_from), str(time_to), str(agent), str(keyPhraseQuery), str(keyPhraseQuery_1),
				str(keyPhraseQuery_2), str(keyPhraseQuery_3))
			else:
				sql = "select DISTINCT user_input, intent_name, source, user_action, user_input_details, featured_contexts, response from events where lang=%s and created >= %s and created < %s and agent_id=%s order by created desc limit 100000;"
				data = (str(language), str(time_from), str(time_to), str(agent),)
		else:
			conn = psycopg2.connect(dbname=spk_dbname, user=spk_user, host=spk_host, password=spk_pwd,
			                        port=int(spk_port))
			cur = conn.cursor()
			if language == 'en':
				if keyPhraseQuery and len(keyPhraseQuery) > 0 and keyAction and len(keyAction) > 0:
					if regexChk == False:
						sql = "select DISTINCT user_input, user_action, user_input_details, featured_contexts, instruction_name, instruction_data, response from events where lang=%s and (user_input like %s or user_input like %s or user_input like %s or user_input like %s) and created >= %s and created < %s and user_action=%s order by created desc limit 100000;"
					else:
						sql = "select DISTINCT user_input, user_action, user_input_details, featured_contexts, instruction_name, instruction_data, response from events where lang=%s and (user_input ~* %s or user_input ~* %s or user_input ~* %s or user_input ~* %s) and created >= %s and created < %s and user_action=%s order by created desc limit 100000;"
					data = (str(language), str(keyPhraseQuery), str(keyPhraseQuery_1), str(keyPhraseQuery_2),
					        str(keyPhraseQuery_3), str(time_from), str(time_to), str(keyAction),)
				elif keyPhraseQuery and len(keyPhraseQuery) > 0:
					if regexChk == False:
						sql = "select DISTINCT user_input, user_action, user_input_details, featured_contexts, instruction_name, instruction_data, response from events where lang=%s and (user_input like %s or user_input like %s or user_input like %s or user_input like %s) and created >= %s and created < %s order by created desc limit 100000;"
					else:
						sql = "select DISTINCT user_input, user_action, user_input_details, featured_contexts, instruction_name, instruction_data, response from events where lang=%s and (user_input ~* %s or user_input ~* %s or user_input ~* %s or user_input ~* %s) and created >= %s and created < %s order by created desc limit 100000;"
					data = (str(language), str(keyPhraseQuery), str(keyPhraseQuery_1), str(keyPhraseQuery_2),
					        str(keyPhraseQuery_3), str(time_from), str(time_to),)
				elif keyAction and len(keyAction) > 0:
					sql = "select DISTINCT user_input, user_action, user_input_details, featured_contexts, instruction_name, instruction_data, response from events where lang=%s and user_action=%s and created >= %s and created < %s order by created desc limit 100000;"
					data = (str(language), str(keyAction), str(time_from), str(time_to),)
				else:
					sql = "select DISTINCT user_input, user_action, user_input_details, featured_contexts, instruction_name, instruction_data, response from events where lang=%s and created >= %s and created < %s order by created desc limit 100000;"
					data = (str(language), str(time_from), str(time_to),)
			else:
				conn.set_client_encoding('utf-8')
				if keyAction and len(keyAction) > 0:
					sql = "select DISTINCT user_input, user_action, user_input_details, featured_contexts, instruction_name, instruction_data, response from events where lang=%s and user_action=%s and created >= %s and created < %s order by created desc limit 100000;"
					data = (str(language), str(keyAction), str(time_from), str(time_to),)
				else:
					if language == 'zh-CN' or language == 'zh-TW' or language == 'zh-HK':
						sql = "select DISTINCT user_input, user_action, user_input_details, featured_contexts, instruction_name, instruction_data, response from events where lang=%s and created >= %s and created < %s order by created desc;"
					else:
						sql = "select DISTINCT user_input, user_action, user_input_details, featured_contexts, instruction_name, instruction_data, response from events where lang=%s and created >= %s and created < %s order by created desc limit 100000;"
					data = (str(language), str(time_from), str(time_to),)

		print strftime("%H:%M:%S", gmtime()), 'executing cursor..'
		cur.execute(sql, data)
		print strftime("%H:%M:%S", gmtime()), 'processing cursor data..'
		x = 0
		index = x
		req_index = x  # to begin from
		req = int(dialogs_quantity)  # requied number of output dialogs(0-all/0<req)

		# print language
		# old variant with dash
		# print keyPhrase
		# 'CJK' in unicodedata.name(i[0].decode('utf8')[0])
		if keyPhraseQuery and len(keyPhraseQuery) > 0:
			if language == 'en':
				query_list = [i for i in ResultIter(cur) if
				              i[0].find('sysnotfoundonwikipedia') == -1 and i[0].find('assistantstart') == -1 and i[
					              0].find('systemclient') == -1 and i[0].find('sys client') == -1 and i[0].find(
					              'assistantfirststart') == -1 and i[0].find('system') == -1 and len(i[0]) > 0]
			elif language == 'zh-CN' or language == 'zh-TW' or language == 'zh-HK':
				if regexChk == False:
					if log_len > 0:
						query_list = [list(i) for i in ResultIter(cur) if
						              len(i[0].decode('utf8')) > int(log_len) and re.search('^[\w\s]+',
						                                                                    i[0]) == None and i[0].find(
							              'sysnotfoundonwikipedia') == -1 and i[0].find('assistantstart') == -1 and i[
							              0].find('systemclient') == -1 and i[0].find('sys client') == -1 and i[0].find(
							              'assistantfirststart') == -1 and i[0].find('system') == -1 and len(i[0]) > 0
						              if re.search(urllib.unquote(request.POST['query'].encode('latin1')), i[0])]
					else:
						query_list = [list(i) for i in ResultIter(cur) if
						              re.search('^[\w\s]+', i[0]) == None and i[0].find(
							              'sysnotfoundonwikipedia') == -1 and i[0].find('assistantstart') == -1 and i[
							              0].find('systemclient') == -1 and i[0].find('sys client') == -1 and i[0].find(
							              'assistantfirststart') == -1 and i[0].find('system') == -1 and len(i[0]) > 0
						              if re.search(urllib.unquote(request.POST['query'].encode('latin1')), i[0])]
				else:
					if log_len > 0:
						query_list = [list(i) for i in ResultIter(cur) if
						              len(i[0].decode('utf8')) > int(log_len) and re.search('^[\w\s]+',
						                                                                    i[0]) == None and re.search(
							              keyPhrase, i[0]) and i[0].find('sysnotfoundonwikipedia') == -1 and i[0].find(
							              'assistantstart') == -1 and i[0].find('systemclient') == -1 and i[0].find(
							              'sys client') == -1 and i[0].find('assistantfirststart') == -1 and i[0].find(
							              'system') == -1 and len(i[0]) > 0]
					else:
						query_list = [list(i) for i in ResultIter(cur) if
						              re.search('^[\w\s]+', i[0]) == None and re.search(keyPhrase, i[0]) and i[0].find(
							              'sysnotfoundonwikipedia') == -1 and i[0].find('assistantstart') == -1 and i[
							              0].find('systemclient') == -1 and i[0].find('sys client') == -1 and i[0].find(
							              'assistantfirststart') == -1 and i[0].find('system') == -1 and len(i[0]) > 0]
			else:
				query_list = [i for i in ResultIter(cur) if
				              i[0].find('sysnotfoundonwikipedia') == -1 and i[0].find('assistantstart') == -1 and i[
					              0].find('systemclient') == -1 and i[0].find('sys client') == -1 and i[0].find(
					              'assistantfirststart') == -1 and i[0].find('system') == -1 and len(i[0]) > 0 if
				              re.search(urllib.unquote(request.POST['query'].encode('latin1')), i[0])]
		else:
			if language == 'zh-CN' or language == 'zh-TW' or language == 'zh-HK':
				if log_len > 0:
					query_list = [list(i) for i in ResultIter(cur) if
					              len(i[0].decode('utf8')) > int(log_len) and re.search('^[\w\s]+', i[0]) == None and i[
						              0].find('-') == -1 and i[0].find('sysnotfoundonwikipedia') == -1 and i[0].find(
						              'assistantstart') == -1 and i[0].find('systemclient') == -1 and i[0].find(
						              'sys client') == -1 and i[0].find('assistantfirststart') == -1 and i[0].find(
						              'system') == -1 and len(i[0]) > 0]
				else:
					query_list = [list(i) for i in ResultIter(cur) if
					              re.search('^[\w\s]+', i[0]) == None and i[0].find('-') == -1 and i[0].find(
						              'sysnotfoundonwikipedia') == -1 and i[0].find('assistantstart') == -1 and i[
						              0].find('systemclient') == -1 and i[0].find('sys client') == -1 and i[0].find(
						              'assistantfirststart') == -1 and i[0].find('system') == -1 and len(i[0]) > 0]
			else:
				query_list = [i for i in ResultIter(cur) if
				              i[0].find('-') == -1 and i[0].find('sysnotfoundonwikipedia') == -1 and i[0].find(
					              'assistantstart') == -1 and i[0].find('systemclient') == -1 and i[0].find(
					              'sys client') == -1 and i[0].find('assistantfirststart') == -1 and i[0].find(
					              'system') == -1 and len(i[0]) > 0]

		if req > 0:
			result_dic = {}
			values_list = list(query_list)
			if language == 'zh-CN' or language == 'zh-TW' or language == 'zh-HK':
				for i in values_list:
					i[0] = i[0].replace(' ', '')
			result_dic['match'] = values_list[0:int(dialogs_quantity)]
			result_dic['unmatch'] = values_list[int(dialogs_quantity):len(values_list)]

			quantity = int(len(result_dic['match'])) + int(len(result_dic['unmatch']))
			if quantity > req:
				quantity_message = 'Found ' + str(quantity) + ' dialogs, showing ' + str(req) + '<br>'
			else:
				quantity_message = 'Found ' + str(quantity) + ' dialogs, showing ' + str(quantity) + '<br>'
				dialogs_quantity = quantity
		else:
			if len(list(query_list)) > 100:
				result_dic = {}
				values_list = list(query_list)
				result_dic['match'] = values_list[0:50]
				result_dic['unmatch'] = values_list[50:len(values_list)]
				req = 50
			else:
				result_dic = {}
				values_list = list(query_list)
				result_dic['match'] = values_list[0:len(values_list)]
				req = len(values_list)

			quantity_message = 'Found ' + str(len(values_list)) + ' dialogs<br>'

		cur.close()
		conn.close()

		print strftime("%H:%M:%S", gmtime()), 'dict done..'

		if len(result_dic['match']) > 0:
			return HttpResponse(json.dumps(
				{'result_dic': result_dic, 'quantity_string': quantity_message, 'index': dialogs_quantity,
				 'quantity': len(query_list), 'raw': values_list, 'agent': agent}))
		else:
			return HttpResponse(json.dumps(
				{'message': values_list, 'quantity_string': quantity_message, 'index': req_index,
				 'quantity': len(query_list), 'agent': agent}))


@csrf_exempt
def apiai_test_result_download(request):
	if request.is_ajax() and request.method == 'POST':
		global soup
		global agent
		global lang
		global format
		global server
		lang = request.POST['language']
		format = request.POST['format']
		agent = request.POST['agent']
		server = request.POST['server']
		table = request.POST['raw'].replace('=\\', '=').replace('\\"', '"').replace('  ', '').replace('\\n', '')
		soup = BeautifulSoup(table, "html.parser")
		return HttpResponse('success')

	if format == 'csv':

		response = HttpResponse(content_type='application/force-download')
		try:
			if language_api_prod_from:
				response[
					'Content-Disposition'] = 'attachment; filename="testing_log_' + agent + '_' + server + '_' + datetime.strptime(
					strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime(
					"%Y_%m_%d_%H_%M_%S") + '.csv"'
			else:
				response[
					'Content-Disposition'] = 'attachment; filename="testing_log_' + agent + '_' + server + '_' + datetime.strptime(
					strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime(
					"%Y_%m_%d_%H_%M_%S") + '.csv"'
		except NameError:
			response[
				'Content-Disposition'] = 'attachment; filename="testing_log_' + agent + '_' + server + '_' + datetime.strptime(
				strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime("%Y_%m_%d_%H_%M_%S") + '.csv"'

		writer = csv.writer(response, delimiter=',', dialect='excel')
		writer.writerow([i.text for i in soup.select('th')])
		for i in soup.select('tr#tr_content'):
			writer.writerow([ii.text.replace('\n', '').replace('\\r', '') for ii in i.select('td#td_content')])

	else:

		row = 1
		col = 0

		output = StringIO()
		book = Workbook(output)
		sheet = book.add_worksheet(
			datetime.strptime(strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime(
				"%Y_%m_%d_%H_%M_%S"))
		sheet.freeze_panes(1, 1, 1)
		sheet.set_column(0, 0, 70)
		sheet.set_column(1, 1, 30)
		sheet.set_column(2, 2, 70)
		sheet.set_column(3, 4, 30)
		sheet.set_column(5, 5, 50)
		sheet.set_column(6, 6, 100)
		sheet.write_row(0, 0, [i.text for i in soup.select('th')])
		for i in soup.select('tr#tr_content'):
			sheet.write_row(row, col,
			                [ii.text.replace('\n', '').replace('\\r', '') for ii in i.select('td#td_content')])
			row += 1
		book.close()
		output.seek(0)
		response = HttpResponse(output.read(),
		                        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		try:
			if language_api_prod_from:
				response[
					'Content-Disposition'] = 'attachment; filename="testing_log_' + agent + '_' + server + '_' + datetime.strptime(
					strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime(
					"%Y_%m_%d_%H_%M_%S") + '.xlsx"'
			else:
				response[
					'Content-Disposition'] = 'attachment; filename="testing_log_' + agent + '_' + server + '_' + datetime.strptime(
					strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime(
					"%Y_%m_%d_%H_%M_%S") + '.xlsx"'
		except NameError:
			response[
				'Content-Disposition'] = 'attachment; filename="testing_log_' + agent + '_' + server + '_' + datetime.strptime(
				strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime("%Y_%m_%d_%H_%M_%S") + '.xlsx"'

	return response


@csrf_exempt
def apiai_prod_ajax_download(request):
	if request.is_ajax() and request.method == 'POST':
		global lang
		global logs
		global agent_from
		global format
		lang = request.POST['language']
		logs = map(lambda x: [line.encode('utf8') for line in x], json.loads(request.POST['raw']))
		agent_from = request.POST['agent']
		format = request.POST['format']
		return HttpResponse('success')

	if format == 'csv':

		response = HttpResponse(content_type='application/force-download')
		try:
			if language_api_prod_from:
				response[
					'Content-Disposition'] = 'attachment; filename="log_' + language_api_prod_from + '_' + datetime.strptime(
					strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime(
					"%Y_%m_%d_%H_%M_%S") + '.csv"'
			else:
				response['Content-Disposition'] = 'attachment; filename="log_' + lang + '_' + datetime.strptime(
					strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime(
					"%Y_%m_%d_%H_%M_%S") + '.csv"'
		except NameError:
			response['Content-Disposition'] = 'attachment; filename="log_' + lang + '_' + datetime.strptime(
				strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime("%Y_%m_%d_%H_%M_%S") + '.csv"'

		writer = csv.writer(response, delimiter=',', dialect='excel')
		if agent_from != 'assistant_logs':
			writer.writerow(['User input', 'Intent name', 'Source', 'User Action', 'Details', 'Contexts', 'Response'])
		else:
			writer.writerow(
				['User input', 'User action', 'Details', 'Context', 'Instruction name', 'Instruction data', 'Response'])
		writer.writerows(logs)

	else:

		row = 1
		col = 0

		output = StringIO()
		book = Workbook(output)
		sheet = book.add_worksheet(
			datetime.strptime(strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime(
				"%Y_%m_%d_%H_%M_%S"))
		sheet.freeze_panes(1, 1, 1)
		sheet.set_column(0, 0, 70)
		sheet.set_column(1, 1, 30)
		sheet.set_column(2, 2, 70)
		sheet.set_column(3, 4, 30)
		sheet.set_column(5, 5, 50)
		sheet.set_column(6, 6, 100)
		sheet.write_row(0, 0, ['User input', 'Intent name', 'Source', 'User Action', 'Details', 'Contexts', 'Response'])
		for i in logs:
			sheet.write_row(row, col, [line.decode('utf8') for line in i])
			row += 1
		book.close()
		output.seek(0)
		response = HttpResponse(output.read(),
		                        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
		try:
			if language_api_prod_from:
				response[
					'Content-Disposition'] = 'attachment; filename="log_' + language_api_prod_from + '_' + datetime.strptime(
					strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime(
					"%Y_%m_%d_%H_%M_%S") + '.xlsx"'
			else:
				response['Content-Disposition'] = 'attachment; filename="log_' + lang + '_' + datetime.strptime(
					strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime(
					"%Y_%m_%d_%H_%M_%S") + '.xlsx"'
		except NameError:
			response['Content-Disposition'] = 'attachment; filename="log_' + lang + '_' + datetime.strptime(
				strftime("%Y-%m-%d %H:%M:%S", gmtime()), "%Y-%m-%d %H:%M:%S").strftime("%Y_%m_%d_%H_%M_%S") + '.xlsx"'

	return response


@csrf_exempt
def apiai_prod_ajax_json_parse(request):
	if request.is_ajax() and request.method == 'POST':
		phrases = []
		intent_json = json.loads(request.POST.dict()['intent'])
		for i in intent_json['userSays']:
			if len(i['data']) == 1:
				text = i['data'][0]['text']
				phrases.append(text)
			else:
				text = ''
				for ii in i['data']:
					text += ii['text']
				phrases.append(text)
		return HttpResponse(json.dumps(phrases))
	return HttpResponse('success')


def apiai_bckp_list_render(request):
	if request.user.is_authenticated():
		logr.debug(str(request.user.username) + ' backup page')
		return render(request, 'apiai_dl_bckp.html')
	else:
		return redirect('login')


def apiai_bckp_list(request):
	dic = {}
	for root, dirnames, filenames in os.walk(apiai_bckp_agenth_path):
		for dir in dirnames:
			path = root + '/' + dir
			for roott, dirnamess, filenamess in os.walk(path):
				dic[dir] = filenamess
	return HttpResponse(json.dumps(dic, sort_keys=True))


@csrf_exempt
def apiai_bckp_download(request):
	if request.is_ajax() and request.method == 'POST':
		global name
		global dir
		dir = request.POST['data'].split('|')[0]
		name = request.POST['data'].split('|')[1]
		return HttpResponse('success')

	filename = apiai_bckp_agenth_path + '/' + dir + '/' + name
	wrapper = FileWrapper(file(filename))
	response = HttpResponse(wrapper, content_type='text/plain')
	response['Content-Disposition'] = 'attachment; filename=%s' % os.path.basename(filename)
	response['Content-Length'] = os.path.getsize(filename)
	return response


@csrf_exempt
def apiai_ajax_download_intent_phrases(request):
	if request.is_ajax() and request.method == 'POST':
		global output_stroke
		global intent
		phrases = json.loads(request.POST.dict()['data'])
		output_stroke = '\n'.join(phrases)
		intent = request.POST.dict()['intent']

	response = HttpResponse(content_type='application/force-download')
	response['Content-Disposition'] = 'attachment; filename=' + intent + '.txt'

	response.write((output_stroke).encode('utf-8'))
	return response


@csrf_exempt
def apiai_ajax_download_intent_gtest(request):
	if request.is_ajax() and request.method == 'POST':
		num = 0
		global sent_file
		global intent
		intent = json.loads(request.POST.dict()['intent'])
		sent_file = 'import org.junit.*\n\n'
		for i in intent['userSays']:
			num += 1
			if len(i['data']) == 1:
				text = i['data'][0]['text']
				sent_file += '\n@Test\ndef test' + str(
					num) + '() {\n  send([query: "' + text + '", resetContexts: true])\n' + "  assertAction('" + intent[
					             'name'] + "')\n}\n"
			else:
				text = ''
				parameter = ''
				for ii in i['data']:
					try:
						if ii['alias']:
							parameter += '  assert response.result.parameters.' + ii['alias'] + '.equalsIgnoreCase(\'' + \
							             ii['text'] + '\')\n'
					except KeyError:
						pass
					text += ii['text']
				sent_file += '\n@Test\ndef test' + str(
					num) + '() {\n  send([query: "' + text + '", resetContexts: true]) ' + '\n'
				sent_file += parameter
				sent_file += "  assertAction('" + intent['name'] + "')\n}\n"
			# return sent_file

	response = HttpResponse(content_type='application/force-download')
	response['Content-Disposition'] = 'attachment; filename=' + intent['name'] + '.gtest'

	response.write((sent_file).encode('utf-8').replace(' ', ' '))
	return response


@csrf_exempt
def apiai_ajax_download_corpora(request):
	def text_getter(file):
		global sent_file
		sent_file = ''
		for i in file['userSays']:
			if len(i['data']) == 1:
				text = i['data'][0]['text']
				sent_file += text + '\n'
			else:
				text = ''
				for ii in i['data']:
					text += ii['text']
				sent_file += text + '\n'
		return sent_file

	if request.is_ajax() and request.method == 'POST':
		global id
		global server
		id = request.POST['data']
		server = request.POST['server']
		print id
		print server

	response = HttpResponse(content_type='application/force-download')
	response['Content-Disposition'] = 'attachment; filename=corpora.txt'

	headers = {'Authorization': id, }

	if server == 'console':
		r = requests.get(apiai_console_url, headers=headers)
		urls = {apiai_console_url_cut + x['id'] + '?v=20150910' for x in json.loads(r.text)}
	elif server == 'stage':
		r = requests.get(apiai_stage_url, headers=headers)
		urls = {apiai_stage_url_cut + x['id'] + '?v=20150910' for x in json.loads(r.text)}
	else:
		r = requests.get(apiai_api_url, headers=headers)
		urls = {apiai_api_url_cut + x['id'] + '?v=20150910' for x in json.loads(r.text)}
	intents = (grequests.get(u, headers=headers) for u in urls)

	output_stroke = ''
	for i in list(grequests.map(intents)):
		try:
			intent = json.loads(i.text)
			text_getter(intent)
			output_stroke += sent_file
		except:
			print i.text

	response.write((output_stroke).encode('utf-8'))
	return response


def apiai_diff_render(request):
	if request.user.is_authenticated():
		logr.debug(str(request.user.username) + ' diff page')
		return render(request, "apiai_diff.html")
	else:
		return redirect('login')


@csrf_exempt
def apiai_diff_get_agents(request):
	def text_getter_intents(file):
		with zf.open(file) as f:
			global sent_file
			sent_file = ''
			try:
				for i in json.loads(f.read())['userSays']:
					if len(i['data']) == 1:
						text = i['data'][0]['text']
						sent_file += text + '\n'
					else:
						text = ''
						for ii in i['data']:
							text += ii['text']
						sent_file += text + '\n'
				sent_file = sent_file[:-1]
			except:
				pass

	def text_getter_intents_raw(file):
		with zf.open(file) as f:
			global sent_file_raw
			try:
				sent_file_raw = f.read()
			except:
				pass

	def text_getter_entities(file):
		with zf.open(file) as f:
			global sent_file
			sent_file = ''
			try:
				for i in json.loads(f.read())['entries']:
					if i['value'] not in i['synonyms']:
						i['synonyms'].append(i['value'])
					sent_file += '\n'.join(i['synonyms']) + '\n'
				sent_file = sent_file[:-1]
			except:
				pass

	def text_getter_entities_raw(file):
		with zf.open(file) as f:
			global sent_file_raw
			try:
				sent_file_raw = f.read()
			except:
				pass

	def download(serv, token, archive_path):

		agent_files_path = archive_path[:-4] + '/'
		testfile = urllib.URLopener()
		url = apiai_diff_get_agents_url
		r = testfile.retrieve(url, archive_path)
		global zf
		zf = zipfile.ZipFile(archive_path)
		try:
			for info in zf.infolist():
				path = agent_files_path + info.filename
				if re.match('entities', info.filename):
					chdir(agent_files_path + 'entities')
					text_getter_entities(info.filename)
					text_getter_entities_raw(info.filename)
				else:
					chdir(agent_files_path + 'intents')
					text_getter_intents(info.filename)
					text_getter_intents_raw(info.filename)
				with open(re.sub('json', 'txt', path), 'w') as w:
					try:
						w.write(sent_file)
					except:
						w.write(sent_file.encode('utf-8'))
				with open(path, 'w') as w:
					try:
						w.write(sent_file_raw)
					except:
						w.write(sent_file_raw.encode('utf-8'))
		finally:
			zf.close()
			os.remove(archive_path)

	if request.is_ajax() and request.method == 'POST':

		if os.environ['PATH'].find('aws') > 0:
			archive_path = apiai_diff_archive_path
			archive_name_left = request.POST['agent_left'] + '.zip'
			archive_name_right = request.POST['agent_right'] + '.zip'
			print archive_name_right

			if os.path.exists(archive_path + archive_name_left[:-4]) == False:
				download(request.POST['server_left'], request.POST['bearer_left'], archive_path + archive_name_left)
			else:
				shutil.rmtree(archive_path + archive_name_left[:-4])
				download(request.POST['server_left'], request.POST['bearer_left'], archive_path + archive_name_left)

			if os.path.exists(archive_path + archive_name_right[:-4]) == False:
				download(request.POST['server_right'], request.POST['bearer_right'], archive_path + archive_name_right)
			else:
				shutil.rmtree(archive_path + archive_name_right[:-4])
				download(request.POST['server_right'], request.POST['bearer_right'], archive_path + archive_name_right)

			p = subprocess.Popen("diff -x=*.json " + archive_path + archive_name_left[
			                                                        :-4] + "/entities/ " + archive_path + archive_name_right[
			                                                                                              :-4] + "/entities/",
			                     stdout=subprocess.PIPE, shell=True)
			(diff, err) = p.communicate()

			diffs = re.findall('diff\s\'-x=\*.json\'\s"?(.+)"?', re.sub('"', '', diff))
			onlys = re.findall('Only in\s(.+\.txt)', re.sub(': ', '', diff))

			pp = subprocess.Popen("diff -x=*.json " + archive_path + archive_name_left[
			                                                         :-4] + "/intents/ " + archive_path + archive_name_right[
			                                                                                              :-4] + "/intents/",
			                      stdout=subprocess.PIPE, shell=True)
			(difff, err) = pp.communicate()
			diffs += re.findall('diff\s\'-x=\*.json\'\s"?(.+)"?', re.sub('"', '', difff))
			onlys += re.findall('Only in\s(.+\.txt)', re.sub(': ', '', difff))

			global diff_result
			diff_result = {}
			diffs_json_filter = [a for a in diffs if 'json' not in a]
			diff_result['diffs'] = diffs_json_filter
			diff_result['onlys'] = onlys
			diffs_files = [a.split('/')[-1][:-4] for a in diff_result['diffs']]
			diff_result['diffs_files'] = sorted(diffs_files)
			onlys_files_list = [a.split('/') for a in diff_result['onlys']]
			onlys_dict = {}
			for i in onlys_files_list:
				if i[4] not in onlys_dict:
					onlys_dict[i[4]] = []
					onlys_dict[i[4]].append(i[-1][:-4])
				else:
					onlys_dict[i[4]].append(i[-1][:-4])
			diff_result['onlys_files'] = onlys_dict
		else:
			global diff_result
			with open('C:\\test\\agents_diff\\diff_test.txt') as f:
				diff = f.read()

			onlys = re.findall('Only in\s(.+\.txt)', re.sub(': ', '', diff))
			diff_result = {}
			diff_result['onlys'] = onlys
			onlys_files = [a.split('/')[-1][:-4] for a in diff_result['onlys']]
			onlys_files_list = [a.split('/') for a in diff_result['onlys']]
			onlys_dict = {}
			for i in onlys_files_list:
				if i[0] not in onlys_dict:
					onlys_dict[i[0]] = []
					onlys_dict[i[0]].append(i[-1][:-4])
				else:
					onlys_dict[i[0]].append(i[-1][:-4])

			archive_path = 'C:\\test\\intents_dump\\'
			diff_result = {'diffs': [
				'C:\\test\\intents_dump\\intents_0\\intents\\calendar.add.txt C:\\test\\intents_dump\\intents_1\\intents\\calendar.add.txt',
				'C:\\test\\intents_dump\\intents_0\\intents\\diff_test.txt C:\\test\\intents_dump\\intents_1\\intents\\diff_test.txt'],
			               'onlys': ['C:\\test\\intents_dump\\intents_0\\intents\\app.current.close.txt'],
			               'diffs_files': ['diff_test', 'animal', 'calendar.add'], 'onlys_files': ['asd']}

		return HttpResponse(json.dumps(diff_result))
	return HttpResponse('hola')


@csrf_exempt
def apiai_diff_getter(request):
	if request.is_ajax() and request.method == 'POST':
		type = request.POST['text']
		res_type = request.POST['type'][5:] + 's'
		print res_type, request.POST['text']
		if os.environ['PATH'].find('aws') > 0:
			entity_search = filter(lambda x: x.find('entities/' + request.POST['text']) > -1, diff_result[res_type])
			intent_search = filter(lambda x: x.find('intents/' + request.POST['text']) > -1, diff_result[res_type])
		else:
			entity_search = filter(lambda x: x.find('entities\\' + request.POST['text']) > -1, diff_result[res_type])
			intent_search = filter(lambda x: x.find('intents\\' + request.POST['text']) > -1, diff_result[res_type])
		if len(entity_search) > 0:
			search_type = 'entity'
		elif len(intent_search) > 0:
			search_type = 'intent'
		search_res = filter(lambda x: len(x) > 0, [entity_search, intent_search])[0][0].split(' ')
		print search_res
		print search_type
		if res_type == 'diffs':
			with open(search_res[0].replace('txt', 'json'), 'r') as f:
				text_0 = f.read()
			with open(search_res[1].replace('txt', 'json'), 'r') as ff:
				text_1 = ff.read()
			ress = [text_0, text_1]
		else:
			with open(search_res[0], 'r') as f:
				text_0 = f.read()
			ress = [text_0]
		return HttpResponse(json.dumps(ress))
	return HttpResponse('success')


@csrf_exempt
def apiai_ajax_download_intent_gtest_archive(request):
	def text_gtest_create(file, action):

		num = 0
		with zf.open(file) as f:
			global sent_file
			sent_file = 'import org.junit.*\n\n'
			for i in json.loads(f.read())['userSays']:
				num += 1
				if len(i['data']) == 1:
					text = i['data'][0]['text']
					sent_file += '\n@Test\ndef test' + str(
						num) + '() {\n  send([query: "' + text + '", resetContexts: true])\n' + "  assertAction('" + action + "')\n}\n"
				else:
					text = ''
					parameter = ''
					for ii in i['data']:
						try:
							if ii['alias']:
								parameter += '  assert response.result.parameters.' + ii[
									'alias'] + '.equalsIgnoreCase(\'' + ii['text'] + '\')\n'
						except KeyError:
							pass
						text += ii['text']
					sent_file += '\n@Test\ndef test' + str(
						num) + '() {\n  send([query: "' + text + '", resetContexts: true]) ' + '\n'
					sent_file += parameter
					sent_file += "  assertAction('" + action + "')\n}\n"
			return sent_file

	def download(serv, token):

		testfile = urllib.URLopener()
		url = apiai_diff_get_agents_url(serv, token)
		r = testfile.retrieve(url)
		global zf
		zf = zipfile.ZipFile(r[0])
		chdir(apiai_diff_dump_path)
		try:
			for info in zf.infolist():
				if info.filename.find('intents') > -1:
					if info.filename.find('context') > -1:
						text_gtest_create(info.filename, 'context')
					else:
						text_gtest_create(info.filename,
						                  re.sub('\s-.+', '', info.filename.split('/')[1].replace('.json', '')))
					with open(re.sub('json', 'gtest', apiai_diff_dump_path + info.filename.split('/')[1]), 'w') as w:
						try:
							w.write(sent_file.replace(' ', ' '))
						except:
							w.write(sent_file.encode('utf-8').replace(' ', ' '))
		finally:
			zf.close()
			os.remove(r[0])
			zipf = zipfile.ZipFile(apiai_diff_dump_path[:-13] + agent + '.zip', 'w', zipfile.ZIP_DEFLATED)
			for root, dirs, files in os.walk(apiai_diff_dump_path):
				for file in files:
					zipf.write(file)
			zipf.close()
			shutil.rmtree(apiai_diff_dump_path)

	if request.is_ajax() and request.method == 'POST':
		chdir(apiai_diff_dump_path)
		global token
		global sent_file
		global agent
		global server
		token = request.POST.dict()['bearer'].replace('Bearer ', '')
		agent = request.POST.dict()['agent']
		server = request.POST.dict()['server']

		download(server, token)

	filename = apiai_diff_dump_path[:-13] + agent + '.zip'
	print filename, os.path.basename(filename)

	response = HttpResponse(FileWrapper(file(filename)), content_type='text/plain')
	response['Content-Disposition'] = 'attachment; filename=%s' % os.path.basename(filename)

	return response


def social_auth_login(request, backend):
	from social_auth.views import auth

	try:
		return auth(request, backend)
	except ValueError, error:
		return render_to_response('users/login_error.html', locals(), context_instance=RequestContext(request))


@csrf_exempt
def bearer_setting(request):
	if request.method == 'POST':
		item, server, clearable_token_to = request.POST['item'], request.POST['server'], request.POST[
			'clearable_token_to']
		bearer, lang, agent, bearer_server = bearer_setting_to(item, server, clearable_token_to)
		return HttpResponse(json.dumps(
			{'item': item, 'server': server, 'clearable_token_to': clearable_token_to, 'bearer': bearer, 'lang': lang,
			 'agent': agent, 'bearer_server': bearer_server}))
	return HttpResponse('unsuccess')


@csrf_exempt
def bearer_setting_from_url(request):
	if request.method == 'POST':
		item, lang, bearer_from = request.POST['item'], request.POST['lang'], request.POST['bearer_from']
		item, bearer_from, lang = bearer_setting_from(item, lang, bearer_from)
		return HttpResponse(json.dumps({'itemm': item, 'bearer_from': bearer_from, 'lang': lang}))
	return HttpResponse('unsuccess')


@csrf_exempt
def url_setting_url(request):
	if request.method == 'POST':
		server = request.POST['server']
		url = url_setting(server)
		return HttpResponse(json.dumps({'url': url}))
	return HttpResponse('unsuccess')


@csrf_exempt
def stat_bearer_setting_url(request):
	if request.method == 'POST':
		item = request.POST['item']
		bearer, lang = stat_bearer_setting(item)
		return HttpResponse(json.dumps({'bearer': bearer, 'lang': lang}))
	return HttpResponse('unsuccess')


@csrf_exempt
def apiai_stat_entities_post(request):
	if request.user.is_authenticated():

		scope = ['https://spreadsheets.google.com/feeds']
		try:
			json_key = json.load(apiai_stat_key)
		except:
			json_key = apiai_stat_key
		# credentials = SignedJwtAssertionCredentials(apiai_stat_key['client_email'], apiai_stat_key['private_key'],scope)
		try:
			credentials = SignedJwtAssertionCredentials(apiai_stat_key['client_email'], apiai_stat_key['private_key'], scope)
		except:
			credentials = ServiceAccountCredentials.from_json_keyfile_dict(json_key, scope)
		gc = gspread.authorize(credentials)
		lang = json.loads(request.body)['lang']

		open_by_key_key = apiai_stat_entity_post_openbykey(lang)
		wks = gc.open_by_key(open_by_key_key)

		if str(date.today().strftime('%d.%m.%y')) not in [i.title for i in wks.worksheets()]:
			worksheet = wks.add_worksheet(title=str(date.today().strftime('%d.%m.%y')), rows="400", cols="20")

		worksheet = wks.get_worksheet(len(wks.worksheets()) - 1)
		worksheet.update_acell('A1', date.today().strftime('%d.%m.%y'))
		worksheet.update_acell('B1', "Quantity")
		worksheet.update_acell('C1', "Compound")
		# worksheet.update_acell('B2', "=sum(B3:B)")

		token = stat_entity_bearer_setting(lang)

		headers = {'Authorization': token, 'Content-Type': 'application/json; charset=utf-8'}
		r = requests.get('http://openapi-stage/api/entities?v=20150910', headers=headers)
		# res_dict = {i['count']: [i['id'], i['name']] for i in json.loads(r.text)}
		# res_dict = [[i['name'], i['id'], i['count']] for i in json.loads(r.text)]
		res_dict = []
		for i in json.loads(r.text):
			if i['preview'][0] == '@':
				res_dict.append([i['name'], i['id'], i['count'], 1])
				continue

			res_dict.append([i['name'], i['id'], i['count'], 0])

		dict_len = len(res_dict) - 1
		cell_end = 'B' + str(3 + dict_len)

		cell_list_key_a = worksheet.range('A3:' + str('A' + str(3 + dict_len)))
		cell_list_key_b = worksheet.range('B3:' + str('B' + str(3 + dict_len)))
		cell_list_key_c = worksheet.range('C3:' + str('C' + str(3 + dict_len)))

		x = 0
		for cell in cell_list_key_a:
			link = apiai_stat_entity_link(lang)
			url = link + str(res_dict[x][1])
			cell.value = '=HYPERLINK("' + url + '","' + res_dict[x][0] + '")'
			x += 1

		x = 0
		for cell in cell_list_key_b:
			cell.value = res_dict[x][2]
			x += 1

		x = 0
		for cell in cell_list_key_c:
			cell.value = res_dict[x][3]
			x += 1

		worksheet.update_cells(cell_list_key_a)
		worksheet.update_cells(cell_list_key_b)
		worksheet.update_cells(cell_list_key_c)

		return HttpResponse(json.dumps({'lang': lang}))
	else:
		return redirect('login')


@csrf_exempt
def apiai_doc_create(request):
	if request.method == 'POST':
		print 'doc'
		token = request.POST['token']
		server = request.POST['server']
		spreadsheet = request.POST['spreadsheet']
		sheetname = request.POST['sheetname']
		print token, server, spreadsheet

		if os.name == 'nt':
			os.chdir('C:\\test\\')
			archive_path = 'C:\\test\\temp_agent.zip'
		elif os.name == 'posix':
			os.chdir('/home/mrukhlov')
			archive_path = '/home/mrukhlov/agents_temp/temp_agent.zip'
			if os.path.exists(archive_path[:-4]):
				shutil.rmtree(archive_path[:-4])
			if os.path.exists(archive_path):
				os.remove(archive_path)

		# json_key = json.loads(key)
		json_key = json.load(open('apiaistatistics-ddf4f136b4ac.json'))
		scope = ['https://spreadsheets.google.com/feeds']
		try:
			credentials = SignedJwtAssertionCredentials(json_key['client_email'], json_key['private_key'], scope)
		except:
			credentials = ServiceAccountCredentials.from_json_keyfile_dict(json_key, scope)
		gc = gspread.authorize(credentials)
		try:
			sh = gc.open_by_key(spreadsheet)
		except:
			return HttpResponse('wrong spreadsheet')

		if sheetname and len(sheetname) > 0:
			sheet = sh.worksheet(sheetname)
		else:
			sheet = sh.worksheet('Sheet1')

		sheet.update_cell(1, 2, 'Returned Object')
		sheet.update_cell(1, 5, 'Context')
		table_header_list = ['Intent Name', 'Action', 'Parameter', 'Entity', 'Input', 'Output', 'Testing Phrases',
		                     'Speech Response', 'Comments', 'Webhook Used']
		table_header_cell_list = sheet.range('A2:J2')

		x = 0
		for cell in table_header_cell_list:
			cell.value = table_header_list[x]
			x += 1

		sheet.update_cells(table_header_cell_list)
		print 'download agent'
		testfile = urllib.URLopener()
		if server == 'prod':
			link = "https://api.api.ai/api/agent/?access_token=" + token
		if server == 'stage':
			link = "http://openapi-stage/api/agent/?access_token=" + token
		if server == 'dev':
			link = "http://openapi-dev/api/agent/?access_token=" + token
		print link
		try:
			r = testfile.retrieve(link, archive_path)
		except IOError:
			return HttpResponse('wrong token')
		# print r, r[1]
		print 'extract agent'
		z = zipfile.ZipFile(archive_path)
		for name in z.namelist():
			z.extract(name, archive_path[:-4])

		intent_row = 3

		table_header_list_overall = []
		print 'scan agent folder'
		for file in os.listdir(archive_path[:-4] + '/intents'):
		# for root, dirnames, filenames in os.walk(archive_path[:-4] + '/intents'):
		# 	for file in filenames:
		# 		if file != 'Default Fallback Intent.json':
		# 			file_name = root + '/' + file
					# print intent_row
			if file != 'Default Fallback Intent.json':
				file_name = os.path.join(archive_path[:-4] + '/intents', file)
				with open(file_name, 'r') as f:
					json_file = json.loads(f.read())
					# print json_file['name']

					intent_name = json_file['name']
					webhook = json_file.get('webhookUsed')
					if not webhook:
						webhook = 'FALSE'

					action = None
					if json_file['responses'][0].has_key('action'):
						action = json_file['responses'][0]['action']

					if json_file['responses'][0].has_key('parameters'):
						parameters = '\n'.join(
							[i['name'] for i in json_file['responses'][0]['parameters'] if i.has_key('dataType')])
						entities = '\n'.join(
							[i['dataType'] for i in json_file['responses'][0]['parameters'] if i.has_key('dataType')])
						if len(parameters) < 1:
							parameters = '\n'.join([i['name'] for i in json_file['responses'][0]['parameters']])
							if len(parameters) < 1:
								parameters = '-'

					if json_file.has_key('contexts'):
						in_context = '\n'.join(json_file['contexts'])
						if len(in_context) < 1:
							in_context = '-'

					if json_file['responses'][0].has_key('affectedContexts'):
						out_context = '\n'.join([i['name'] for i in json_file['responses'][0]['affectedContexts']])
						if len(out_context) < 1:
							out_context = '-'

					responses = '-'
					if json_file['responses'][0].has_key('messages') and len(json_file['responses'][0]['messages']) > 0:
						if type(json_file['responses'][0]['messages'][0]['speech']) is not list:
							responses = json_file['responses'][0]['messages'][0]['speech']
						else:
							responses = '\n'.join(json_file['responses'][0]['messages'][0]['speech'])

					comments = ''

					phrases = []

					phrases_dict = {}
					for i in json_file['userSays']:
						if len(i['data']) == 1:
							text = i['data'][0]['text']
							phrases_dict[text] = text.count('@')
						else:
							entity_occur = 0
							phrase_len = len(i['data'])
							text = ''
							for ii in i['data']:
								try:
									if ii['meta'] != '@sys.ignore':
										text += ii['meta']
										# text += ii['text']
										entity_occur += 1
									else:
										text += ii['text']
										phrase_len = 1
								except KeyError:
									text += ii['text']
							phrases_dict[text] = entity_occur

					# print phrases_dict

					if len(phrases_dict.keys()) > 4:
						max_paramaters_q = max(phrases_dict.values())
						if max_paramaters_q > 3:
							while len(phrases) < 3:
								try:
									phrase = phrases_dict.keys()[phrases_dict.values().index(max_paramaters_q)]
								except ValueError:
									pass
								phrases.append(phrase)
								# print phrase
								max_paramaters_q -= 1
						else:
							while len(phrases) < 3:
								if max_paramaters_q > 0:
									try:
										phrase = phrases_dict.keys()[phrases_dict.values().index(max_paramaters_q)]
									except ValueError:
										pass
									phrases.append(phrase)
									max_paramaters_q -= 1
								else:
									p = phrases_dict.keys()[random.randrange(0, len(phrases_dict.keys()))]
									if p not in phrases:
										phrases.append(p)
					else:
						phrases = phrases_dict.keys()
					# print phrases

					table_header_list = [intent_name, action, parameters, entities, in_context, out_context,
					                     '\n'.join(phrases),
					                     responses, comments, webhook]

					table_header_list_overall.append(table_header_list)
					# print len(table_header_list), table_header_list[0]
					# print table_header_list

				'''table_header_cell_list = sheet.range('A' + str(intent_row) + ':H' + str(intent_row))

				x = 0
				for cell in table_header_cell_list:
					cell.value = table_header_list[x]
					x += 1

				sheet.update_cells(table_header_cell_list)
				intent_row += 1'''

		#intent_name

		table_header_cell_list = sheet.range('A3' + ':A' + str(len(table_header_list_overall)+2))

		x = 0
		for cell in table_header_cell_list:
			cell.value = [intent_name[0] for intent_name in table_header_list_overall][x]
			x += 1

		sheet.update_cells(table_header_cell_list)

		#action

		table_header_cell_list = sheet.range('B3' + ':B' + str(len(table_header_list_overall)+2))

		x = 0
		for cell in table_header_cell_list:
			cell.value = [intent_name[1] for intent_name in table_header_list_overall][x]
			x += 1

		sheet.update_cells(table_header_cell_list)

		#parameter

		table_header_cell_list = sheet.range('C3' + ':C' + str(len(table_header_list_overall)+2))

		x = 0
		for cell in table_header_cell_list:
			cell.value = [intent_name[2] for intent_name in table_header_list_overall][x]
			x += 1

		sheet.update_cells(table_header_cell_list)

		#entity

		table_header_cell_list = sheet.range('D3' + ':D' + str(len(table_header_list_overall)+2))

		x = 0
		for cell in table_header_cell_list:
			cell.value = [intent_name[3] for intent_name in table_header_list_overall][x]
			x += 1

		sheet.update_cells(table_header_cell_list)

		#input_context

		table_header_cell_list = sheet.range('E3' + ':E' + str(len(table_header_list_overall)+2))

		x = 0
		for cell in table_header_cell_list:
			cell.value = [intent_name[4] for intent_name in table_header_list_overall][x]
			x += 1

		sheet.update_cells(table_header_cell_list)

		#output_context

		table_header_cell_list = sheet.range('F3' + ':F' + str(len(table_header_list_overall)+2))

		x = 0
		for cell in table_header_cell_list:
			cell.value = [intent_name[5] for intent_name in table_header_list_overall][x]
			x += 1

		sheet.update_cells(table_header_cell_list)

		#testing_phrases

		table_header_cell_list = sheet.range('G3' + ':G' + str(len(table_header_list_overall)+2))

		x = 0
		for cell in table_header_cell_list:
			cell.value = [intent_name[6] for intent_name in table_header_list_overall][x]
			x += 1

		sheet.update_cells(table_header_cell_list)

		#response

		table_header_cell_list = sheet.range('H3' + ':H' + str(len(table_header_list_overall)+2))

		x = 0
		for cell in table_header_cell_list:
			cell.value = [intent_name[7] for intent_name in table_header_list_overall][x]
			x += 1

		sheet.update_cells(table_header_cell_list)

		#comments

		table_header_cell_list = sheet.range('I3' + ':I' + str(len(table_header_list_overall)+2))

		x = 0
		for cell in table_header_cell_list:
			cell.value = [intent_name[8] for intent_name in table_header_list_overall][x]
			x += 1

		sheet.update_cells(table_header_cell_list)

		#webhook

		table_header_cell_list = sheet.range('J3' + ':J' + str(len(table_header_list_overall)+2))

		x = 0
		for cell in table_header_cell_list:
			cell.value = [webhook[9] for webhook in table_header_list_overall][x]
			x += 1

		sheet.update_cells(table_header_cell_list)

		if os.name == 'posix':
			os.remove(archive_path)
			shutil.rmtree(archive_path[:-4])
		return HttpResponse('success')
	return HttpResponse('not a POST req')


@csrf_exempt
def apiai_agent_create(request):
	if request.method == 'POST':
		print 'agent'
		token = request.POST['token']
		server = request.POST['server']
		spreadsheet = request.POST['spreadsheet']
		print token, server, spreadsheet

		headers = {'Authorization': 'Bearer ' + token}

		if os.name == 'nt':
			os.chdir('C:\\test\\')
			archive_path = 'C:\\test\\Python.zip'
		elif os.name == 'posix':
			os.chdir('/home/mrukhlov')
			archive_path = '/home/mrukhlov/agents_temp/generic_agent.zip'

		# json_key = json.loads(key)
		json_key = json.load(open('apiaistatistics-ddf4f136b4ac.json'))
		scope = ['https://spreadsheets.google.com/feeds']
		try:
			credentials = SignedJwtAssertionCredentials(json_key['client_email'], json_key['private_key'], scope)
		except:
			credentials = ServiceAccountCredentials.from_json_keyfile_dict(json_key, scope)
		gc = gspread.authorize(credentials)
		try:
			sh = gc.open_by_key(spreadsheet)
		except:
			return HttpResponse('wrong spreadsheet')

		sheet = sh.worksheet('Sheet1')
		sheet_data = sheet.get_all_values()[2:]

		if server == 'prod':
			link = 'https://console.api.ai/api/agent/?clear=true'
		if server == 'stage':
			link = 'http://openapi-stage/api/agent/?clear=true'
		if server == 'dev':
			link = 'https://gdev.api.ai/api/agent/?clear=true'

		with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as f:
			for stroke in sheet_data:
				empty_intent = '{"name": "' + stroke[
					0] + '","auto": true,"contexts": [],"userSays": [],"responses": [{"action": "' + stroke[
					               1] + '"}],"state": "LEARNED","priority": 500000,"webhookUsed": false}'

				new_intent_json = json.loads(empty_intent)

				fallback = '{"name": "Default Fallback Intent","auto": true,"contexts": [],"userSays": [],"responses": [  {    "resetContexts": false,    "action": "input.unknown",    "affectedContexts": [],    "parameters": [],    "messages": [      {        "type": 0,        "speech": [          "I\u0027m sorry. I\u0027m having trouble understanding the question.",          "I think I may have misunderstood your last statement.",          "I\u0027m sorry. I didn\u0027t quite grasp what you just said.",          "I don\u0027t think I\u0027m qualified to answer that yet.",          "I\u0027m a bit confused by that last part.",          "I\u0027m not totally sure about that.",          "I\u0027m not sure I follow.",          "I\u0027m afraid I don\u0027t understand.",          "I\u0027m a bit confused."        ]      }    ]  }],"priority": 500000,"webhookUsed": false,"fallbackIntent": true}'
				f.writestr('intents/Default Fallback Intent.json', fallback)

				# parameters
				if stroke[2] != '-' and len(stroke[2]) > 1:
					new_intent_json['responses'][0]["parameters"] = []
					parameters = stroke[2].split('\n')
					for para in parameters:
						re_para = re.search('(.+)\s\((@.+)\)', para)
						if re_para:
							new_intent_json['responses'][0]["parameters"].append(
								{"dataType": re_para.group(2), "name": re_para.group(1),
								 "value": '$' + re_para.group(1), "isList": "false"})
							if re_para.group(2).find('sys') < 0:
								empty_entity = '{"name": "' + re_para.group(2)[
								                              1:] + '", "isOverridable": true, "entries": [{"value": "' + re_para.group(
									2)[1:] + '","synonyms": ["' + re_para.group(2)[
								                                  1:] + '"]}], "isEnum": false, "automatedExpansion": false}'
								f.writestr('entities/' + re_para.group(2)[1:] + '.json', empty_entity)
						else:
							new_intent_json['responses'][0]["parameters"].append(
								{"dataType": para, "name": para, "value": '$' + para, "isList": "false"})

				# in_context
				if stroke[3] != '-' and len(stroke[3]) > 1:
					new_intent_json["contexts"] = []
					contexts = stroke[3].split('\n')
					for context in contexts:
						new_intent_json["contexts"].append(context)

				# out_context
				if stroke[4] != '-' and len(stroke[4]) > 1:
					new_intent_json['responses'][0]["affectedContexts"] = []
					out_contexts = stroke[4].split('\n')
					for out_context in out_contexts:
						new_intent_json['responses'][0]["affectedContexts"].append({'name': out_context, "lifespan": 5})

				# inputs
				if stroke[5] != '-' and len(stroke[5]) > 1:
					new_intent_json['userSays'] = []
					inputs = stroke[5].split('\n')
					for input in inputs:
						template = {"isTemplate": "false", "data": [{"text": input}]}
						new_intent_json['userSays'].append(template)

				# responses
				if stroke[6] != '-' and len(stroke[6]) > 1:
					new_intent_json['responses'][0]["messages"] = []
					inputs = stroke[6].split('\n')
					template = {"type": 0, "speech": inputs}
					new_intent_json['responses'][0]["messages"].append(template)

				f.writestr('intents/' + stroke[0] + '.json', json.dumps(new_intent_json))

		fileobj = open(archive_path, 'rb')
		r = requests.post(link, headers=headers, files={"archive": ('generic_agent.zip', fileobj)})

		if os.name == 'posix':
			os.remove(archive_path)

		if json.loads(r.text)['status']['code'] == 200:
			return HttpResponse('success')
		else:
			return HttpResponse('failed')

	return HttpResponse('not a POST req')


def apiai_overview_create(request):

	if request.method == 'POST':
		token = request.POST['overview_token']
		if token and len(token) > 0:
			link = "https://api.api.ai/api/agent/?access_token=" + token

			if os.name == 'nt':
				os.chdir('C:\\test\\')
				archive_path = 'C:\\test\\overview.zip'
			elif os.name == 'posix':
				os.chdir('/home/mrukhlov')
				archive_path = '/home/mrukhlov/agents_temp/temp_agent.zip'

			testfile = urllib.URLopener()
			try:
				r = testfile.retrieve(link, archive_path)
			except IOError:
				return HttpResponse('wrong token')

			z = zipfile.ZipFile(archive_path)
			for name in z.namelist():
				z.extract(name, archive_path[:-4])

			number_of_intents = len(os.listdir(archive_path[:-4] + '/intents'))
			number_of_entities = len(os.listdir(archive_path[:-4] + '/entities'))
			intents_examples_quantity = 0
			entities_examples_quantity = 0
			intents_examples_dict = {}
			entities_examples_dict = {}


			for root, dirnames, filenames in os.walk(archive_path[:-4] + '/intents'):
				for file in filenames:
					if file != 'Default Fallback Intent.json' and file != 'Default Welcome Intent.json':
						file_name = os.path.join(root, file)
						with open(file_name, 'r') as f:
							json_file = json.loads(f.read())
							intents_examples_dict[file.replace('.json', '')] = len(json_file['userSays'])
							intents_examples_quantity += len(json_file['userSays'])

			intents_examples_max = max(intents_examples_dict.values())
			intents_examples_min = min(intents_examples_dict.values())
			print intents_examples_max
			intent_max = intents_examples_dict.keys()[intents_examples_dict.values().index(intents_examples_max)]
			print intents_examples_min
			intent_min = intents_examples_dict.keys()[intents_examples_dict.values().index(intents_examples_min)]
			print intents_examples_quantity


			for root, dirnames, filenames in os.walk(archive_path[:-4] + '/entities'):
				for file in filenames:
					file_name = os.path.join(root, file)
					with open(file_name, 'r') as f:
						json_file = json.loads(f.read())
						entities_examples_dict[file.replace('.json', '')] = len(json_file['entries'])
						entities_examples_quantity += len(json_file['entries'])

			entities_examples_max = max(entities_examples_dict.values())
			entities_examples_min = min(entities_examples_dict.values())
			print entities_examples_max
			entity_max = entities_examples_dict.keys()[entities_examples_dict.values().index(entities_examples_max)]
			print entities_examples_min
			entity_min = entities_examples_dict.keys()[entities_examples_dict.values().index(entities_examples_min)]
			print entities_examples_quantity

			json_key = json.load(open('apiaistatistics-ddf4f136b4ac.json'))
			scope = ['https://spreadsheets.google.com/feeds']
			try:
				credentials = SignedJwtAssertionCredentials(json_key['client_email'], json_key['private_key'], scope)
			except:
				credentials = ServiceAccountCredentials.from_json_keyfile_dict(json_key, scope)
			gc = gspread.authorize(credentials)
			sh = gc.open_by_key('1tXsJvJQtRADCxeQQkDGcVybG4Hp1vRC5BjZ29myeNjo')

			sheet = sh.worksheet('Sheet1')

			sheet.update_cell(1, 1, 'Agent Token')
			sheet.update_cell(1, 2, token)

			sheet.update_cell(2, 1, 'Number of intents')
			sheet.update_cell(2, 2, number_of_intents)

			sheet.update_cell(3, 1, 'Number of examples in all intents')
			sheet.update_cell(3, 2, intents_examples_quantity)

			sheet.update_cell(4, 1, 'Max number of examples per intent')
			sheet.update_cell(4, 2, intents_examples_max)
			sheet.update_cell(4, 3, intent_max)

			sheet.update_cell(5, 1, 'Min number of examples per intent')
			sheet.update_cell(5, 2, entities_examples_min)
			sheet.update_cell(5, 3, intent_min)

			sheet.update_cell(2, 4, 'Number of entities')
			sheet.update_cell(2, 5, number_of_entities)

			sheet.update_cell(3, 4, 'Number of examples in all entities')
			sheet.update_cell(3, 5, entities_examples_quantity)

			sheet.update_cell(4, 4, 'Max number of examples per entity')
			sheet.update_cell(4, 5, entities_examples_max)
			sheet.update_cell(4, 6, entity_max)

			sheet.update_cell(5, 4, 'Min number of examples per entity')
			sheet.update_cell(5, 5, entities_examples_min)
			sheet.update_cell(5, 6, entity_min)

			if os.name == 'posix':
				os.remove(archive_path)
				shutil.rmtree(archive_path[:-4])

			# return redirect('/apiai_stat')
			overview_link = 'https://docs.google.com/spreadsheets/d/1tXsJvJQtRADCxeQQkDGcVybG4Hp1vRC5BjZ29myeNjo/edit#gid=0'
			return render(request, 'apiai_statistics.html', {'link':overview_link})
		else:
			return redirect('/apiai_stat')
	else:
		return redirect('/apiai_stat')


@csrf_exempt
def sap_agent_create(request):
	if request.method == 'POST':
		print 'agent'
		token = request.POST['token']
		server = request.POST['server']
		spreadsheet = request.POST['spreadsheet']
		print token, server, spreadsheet

		headers = {'Authorization': 'Bearer ' + token}

		if os.name == 'nt':
			os.chdir('C:\\test\\')
			archive_path = 'C:\\test\\Python.zip'
		elif os.name == 'posix':
			os.chdir('/home/mrukhlov')
			archive_path = '/home/mrukhlov/agents_temp/generic_agent.zip'

		if server == 'prod':
			link = 'https://console.api.ai/api/agent/?clear=true'
		if server == 'stage':
			link = 'http://openapi-stage/api/agent/?clear=true'
		if server == 'dev':
			link = 'https://gdev.api.ai/api/agent/?clear=true'

		def gsheets_auth():
			print 'auth in progress'
			json_key = json.load(open('apiaistatistics-ddf4f136b4ac.json'))
			scope = ['https://spreadsheets.google.com/feeds']
			try:
				credentials = SignedJwtAssertionCredentials(json_key['client_email'], json_key['private_key'], scope)
			except:
				credentials = ServiceAccountCredentials.from_json_keyfile_dict(json_key, scope)
			gc = gspread.authorize(credentials)
			try:
				sh = gc.open_by_key(spreadsheet)
			except:
				return HttpResponse('wrong spreadsheet')
			return sh

		def sheets_get(spradsheet):
			sheet = spradsheet.get_worksheet(0)
			return sheet


		sh = gsheets_auth()
		sheet = sheets_get(sh)

		def val_return(sheet):
			all = sheet.get_all_values()
			return [[ii[i] for ii in all if ii[i]] for i in range(0, len(all[0]))]

		all_val = val_return(sheet)
		print all_val

		if os.name == 'nt':
			os.chdir('C:\\test\\')
			archive_path = 'C:\\test\\Python.zip'
		elif os.name == 'posix':
			os.chdir('/home/mrukhlov')
			archive_path = '/home/mrukhlov/agents_temp/generic_agent.zip'

		# fallback = '{"name": "Default Fallback Intent","auto": true,"contexts": [],"userSays": [],"responses": [  {    "resetContexts": false,    "action": "input.unknown",    "affectedContexts": [],    "parameters": [],    "messages": [      {        "type": 0,        "speech": [          "I\u0027m sorry. I\u0027m having trouble understanding the question.",          "I think I may have misunderstood your last statement.",          "I\u0027m sorry. I didn\u0027t quite grasp what you just said.",          "I don\u0027t think I\u0027m qualified to answer that yet.",          "I\u0027m a bit confused by that last part.",          "I\u0027m not totally sure about that.",          "I\u0027m not sure I follow.",          "I\u0027m afraid I don\u0027t understand.",          "I\u0027m a bit confused."        ]      }    ]  }],"priority": 500000,"webhookUsed": false,"fallbackIntent": true}'

		with zipfile.ZipFile(archive_path, 'w', zipfile.ZIP_DEFLATED) as f:
			# f.writestr('entities/fallback.json', json.dumps(fallback))
			empty_intent = json.loads('{"name": "main", "auto": true,"contexts": [],"userSays": [],"responses": [{"action": "main"}],"state": "LEARNED","priority": 500000,"webhookUsed": false}')
			main_entity = json.loads('{"name": "main", "isOverridable": true, "entries": [{"value": "","synonyms": []}], "isEnum": true, "automatedExpansion": false}')
			for col in all_val:
				empty_entity = json.loads('{"name": "", "isOverridable": true, "entries": [{"value": "","synonyms": []}], "isEnum": false, "automatedExpansion": false}')
				empty_entity['name'] = col[0].lower().replace(' ', '_')
				intent_inner = col[1:]
				main_entity['entries'].append({"value": '@'+col[0].lower().replace(' ', '_')+':'+col[0].lower().replace(' ', '_').replace('@', ''), "synonyms": []})
				for word in intent_inner:
					if word.find('@') > -1:
						empty_entity['isEnum'] = True
						empty_entity['entries'].append({"value": word.lower().replace(' ', '_')+':'+word.lower().replace(' ', '_').replace('@', ''),"synonyms": []})
					else:
						empty_entity['entries'].append({"value": word,"synonyms": [word]})
				f.writestr('entities/' + col[0].lower().replace(' ', '_')    + '.json', json.dumps(empty_entity))
			f.writestr('entities/main.json', json.dumps(main_entity))

			empty_intent['userSays'] = []
			template = {"isTemplate": "false", "data": [{"text": word, 'alias': 'parameter', 'meta': '@main', 'userDefined': 'false'}]}
			empty_intent['userSays'].append(template)
			template = {"isTemplate": "false", "data": [{"text": "filter by "}, {"text": word, 'alias': 'parameter', 'meta': '@main', 'userDefined': 'false'}]}
			empty_intent['userSays'].append(template)

			empty_intent['responses'][0]['parameters'] = []
			empty_intent['responses'][0]['parameters'].append(
				{
					"dataType": "@main",
					"name": "parameter",
					"value": "$parameter",
					"isList": 'true'
				}
			)

			f.writestr('intents/main.json', json.dumps(empty_intent))

			fileobj = open(archive_path, 'rb')
			r = requests.post(link, headers=headers, files={"archive": ('generic_agent.zip', fileobj)})

		if os.name == 'posix':
			os.remove(archive_path)

		if json.loads(r.text)['status']['code'] == 200:
			return HttpResponse('success')
		else:
			return HttpResponse('failed')

	return HttpResponse('not a POST req')

@csrf_exempt
def templates_fix(request):

	token = request.POST['token']
	server = request.POST['server']

	status = template_fix(token, server)
	print status
	code = status['status']['code']
	message = status['message']

	return HttpResponse(json.dumps([code, message]))
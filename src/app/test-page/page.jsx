"use client";

import Navbar from "@/components/ui/navbar";
import React, { useState } from "react";
import Avatar from "../../../public/assets/image.png";
import Button from "@/components/ui/button";
import RadioButton from "@/components/ui/radio-button";
import Checkbox from "@/components/ui/checkbox"; // <— import komponen lo
import Chip from "@/components/ui/chip";
import Dropdown from "@/components/ui/dropdown";
import TextInput from "@/components/ui/input";
import TextArea from "@/components/ui/text-area";
import SearchInput from "@/components/ui/search";
const Test = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorValue, setErrorValue] = useState("Ini adalah pesan error.");
  const [description, setDescription] = useState("");
  const [filledText, setFilledText] = useState(
    "Ini adalah teks yang sudah diisi."
  );
  const [search, setSearch] = useState("");
  const handleSearch = () => {
    if (!search.trim()) return alert("Masukin dulu teksnya 😤");
    console.log("Searching for:", search);
  };
  return (
    <div className="w-full">
      <Navbar avatar={Avatar} />
      <div className="min-h-screen w-full flex flex-wrap mt-10 items-start justify-center">
        {/* ==== BUTTON SECTION ==== */}
        <div className="flex flex-col gap-2 ml-10">
          <p>Button</p>
          <Button label="Button Primary" size="very-small" variant="primary" />
          <Button label="Button Secondary" size="small" variant="secondary" />
          <Button label="Button Tertiary" size="big" variant="tertiary" />
          <Button
            label="Button Disabled"
            size="small"
            disabled
            variant="disabled"
          />
        </div>

        {/* ==== RADIO SECTION ==== */}
        <div className="flex flex-col gap-2 ml-10">
          <p>Radio Button</p>
          <RadioButton
            name="option"
            options={["Option 1", "Option 2", "Option 3"]}
            defaultValue="Option 1"
          />
        </div>

        {/* ==== CHECKBOX SECTION ==== */}
        <div className="flex flex-col gap-2 ml-10">
          <p>Checkbox</p>
          <Checkbox label="Accept Terms" defaultChecked={true} />
          <Checkbox label="Subscribe Newsletter" defaultChecked={false} />
          <Checkbox label="Disabled Checkbox" defaultChecked={true} disabled />
        </div>

        {/* ==== CHIP SECTION ==== */}
        <div className="flex flex-col gap-2 ml-10">
          <p>Checkbox</p>
          <Chip label="Active" variant="primary" onClick={() => {}} />
          <Chip label="Inactive" variant="secondary" onClick={() => {}} />
          <Chip label="Another" variant="tertiary" onClick={() => {}} />
        </div>

        {/* ==== DROPDOWN SECTION ==== */}
        <div className="flex flex-col gap-2 ml-10">
          <p>Dropdown</p>
          <Dropdown options={["halo", "alo", "qalo"]} />
        </div>

        {/* ==== INPUT SECTION ==== */}
        <div className="flex flex-col gap-2 ml-10">
          <p>Input</p>
          <div className="p-8">
            {/* 1. Default / Placeholder */}
            <TextInput
              label="Nama"
              placeholder="Masukkan nama Anda"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="Isi dengan nama lengkap."
            />

            {/* 2. Filled */}
            <TextInput
              label="Email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              helperText="Email sudah terisi."
            />

            {/* Password */}
            <TextInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              // error={errorValue}
              helperText="Password minimal 8 karakter."
              required
            />

            {/* 3. Error */}
            <TextInput
              label="Password"
              value="password_salah"
              error={errorValue}
              helperText="Password minimal 8 karakter."
              required
              readOnly
            />

            {/* 4. Disabled */}
            <TextInput
              label="Status"
              value="Tidak Aktif"
              disabled
              helperText="Input ini dinonaktifkan."
            />
          </div>

          {/* ==== TEXT AREA SECTION ==== */}
          <div className="flex flex-col gap-2 ml-10">
            <p>Text Area</p>
            <div className="p-8">
              {/* 1. Default / Placeholder */}
              <TextArea
                label="Deskripsi Proyek"
                placeholder="Tulis deskripsi di sini"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                helperText="Jelaskan secara singkat."
              />

              {/* 2. Filled & Focused (Fokus ditangani browser) */}
              <TextArea
                label="Umpan Balik"
                value={filledText}
                onChange={(e) => setFilledText(e.target.value)}
                helperText="Teks sudah terisi penuh."
              />

              {/* 3. Error */}
              <TextArea
                label="Ringkasan"
                value="Teks ini menyebabkan error. Teks ini menyebabkan error."
                error="Ringkasan tidak boleh mengandung kata 'error'."
                maxLength={50}
                required
                readOnly
              />

              {/* 4. Disabled */}
              <TextArea
                label="Catatan"
                value="Input ini dinonaktifkan."
                disabled
                helperText="Tidak dapat diubah."
              />
            </div>
          </div>
          <div className="p-8 max-w-md mx-auto">
            <SearchInput
              placeholder="Cari user, produk, atau ide..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={handleSearch}
            />
          </div>
        </div>                                            
      </div>
    </div>
  );
};

export default Test;

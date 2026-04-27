"use client";

import Image from "next/image";
import Link from "next/link";
import {
  User,
  FileText,
  Car,
  Settings,
  History,
  Wrench,
  MapPin,
  Truck,
  CheckCircle,
  Plus,
} from "lucide-react";

const adventurer = {
  slug: "tracker",
  callsign: "Tracker",
  location: "Melbourne, AUS",
  rank: "Pathfinder",
  memberSince: "2021",
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC-uV5lBzf_nq6bQF4capgSRo4L0VTljWvQeqqpswaF4hlLHMLYbkz4DvdzpWF3cph7KYFXjkmkz18Gtsoidt1vehAjtGhXMWVVCfZJHrTa9NKvctjJha688X9DBulC1nQ3CUD-HWrZFMBu-_oHJnjqoOF-Wfggy4j_UFiCu0csNEzYgoankS7zKIjzHZsx25K3Jpc365y29sS2qprsjLzLbr1wn8diKMvyHli_6r2P97XW5glIR55HzmnZb6lZQZ9eUb0WnR5BRd96",
  avatarAlt: "Close up portrait of a rugged man with a beard wearing a dark tactical jacket",
  backgroundImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCQ9V9ydORmB9vHeye3OUCBWqo3jk4VjJDvD7Cz8QEi_Y7Yz2NYaiL7HyL7t0f5v--BExlBBCWr5E2RtMzRkCDc8Od7hV0IPzPo3-uQHRL7Veks1NAb2DUl5xVbRzYRKwD4LeuIRA4MbwAPhQyhUN9prniBpBBoyrm73GnqbZ-9PBgWlufsNlcq1-bvsg_DPUS6jrjTE8JlmBcHHXi4iWqbhu_xURruRLUEssfPcSUJq7RLJT-8pXTfmu1S0HJV5L2Q0W0WWyJFSow4",
  terrainAlt: "Dark, moody topographic map texture representing rugged off-road terrain",
};

const orders = [
  {
    id: "EXP-8924",
    name: "Overland Rooftop Tent - MK II",
    price: "$1,250.00",
    status: "Dispatched",
    trackingStatus: "In Transit",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5XMqmta6Di0EJ2BzSII0FHybJuHMp5SRwGMfh888RAOv7N2mncFM-NOL9K3wYxjf500-1h3N3Ei8hSKucC5UGFtT0NcBZURDca4FEDaJ2LMwGDrtVKmbe91CW0dA7anMnD-ogpFnIZn2pykPl_cHi8e3PbudpwtrgvJTQwcT6cGY0Os46FBghSRcrLUlnhUBGYis-FlG4Ezry5bwblLl5BCeCKR9LWbyxo3XgpNw7_uwBFfZPYCVZT5NnHer4-4hDkHMxCl3dMh94",
    imageAlt: "Rugged canvas rooftop tent mounted on an off-road vehicle in the desert",
  },
  {
    id: "EXP-8810",
    name: "12,000lb Recovery Winch",
    price: "$890.00",
    status: "Delivered",
    trackingStatus: "Complete",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD_k2LpB_8l_dIM-t_5_iC8XIPy6LDxulYa5SOOpgPVNcgn5wGXQ4CD3dxo8BUQqZaNB_5MeA6R3M17Bwpcb6Gkt6GwxdY1tq5xkGCr9DPA5Faz19XblDQvIMehJVrC_zf-YC3KWX8nl9bk7zKMxzaMJIq3CbBTnkACYz7AZalHWJDLSUpS_0N9Z2mZVkStdLuFye_isDyzmt4RptJMRZ7tOrVtQs18qWxJUDQQWeUgH-Lj9i3OpnlobIsccrxQ66ZWy11l2nWJGrk2",
    imageAlt: "Heavy duty electric winch mounted on a steel bullbar of a 4x4 truck",
    isComplete: true,
  },
];

const rig = {
  name: "LC79 DUAL CAB",
  image:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAwfjhysDa1v5JvRX4ntncfb0kZDRdY43Gr2lefy-LK14WNUXZnhKdXefNdio88ggUUhNzXM6nK_wc3axC5LV8Kb3mR0UhMR_5Knn13f7RchYxOKPHCbbhnpLV-n9OK56JZ2ULaCjrpfSqBbuzzI73Uz48uq4QQnP2V3-cqm0UmntvnR_Z-7S0oqbcZHO0J1__8RX65BUVjInhO_NMotJKy7RTsy6UbXtJiouPcbJXjMhvM64g0XtLew1SeZsnNnf0VwKV_gSREkVnG",
  imageAlt: "Front angle view of a heavily modified Toyota Land Cruiser 70 series in the outback dirt",
  engine: "4.5L V8 Turbo Diesel",
  suspension: "2\" Lift, Heavy Duty",
  tires: "33\" Mud Terrain",
  status: "Trail Ready",
};

export default function AdventurerProfilePage() {
  return (
    <div className="flex-grow pt-24 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8 pb-16">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-surface-container-low rounded-sm p-6 sticky top-28">
          <div className="flex flex-col gap-4">
            <Link
              href="#"
              className="flex items-center gap-3 text-primary font-headline font-bold text-lg p-3 bg-surface-container-high rounded-sm"
            >
              <User className="w-5 h-5" />
              Overview
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 text-on-surface opacity-70 hover:opacity-100 hover:text-primary transition-colors font-headline font-semibold text-lg p-3"
            >
              <FileText className="w-5 h-5" />
              Orders
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 text-on-surface opacity-70 hover:opacity-100 hover:text-primary transition-colors font-headline font-semibold text-lg p-3"
            >
              <Car className="w-5 h-5" />
              Garage
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 text-on-surface opacity-70 hover:opacity-100 hover:text-primary transition-colors font-headline font-semibold text-lg p-3"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col gap-8">
        {/* Tactical Profile Header */}
        <section className="bg-surface-container-high rounded-sm p-8 relative overflow-hidden group">
          <div className="absolute inset-0 z-0">
            <Image
              src={adventurer.backgroundImage}
              alt={adventurer.terrainAlt}
              fill
              className="object-cover opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-high via-surface-container-high/90 to-transparent" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 rounded-sm overflow-hidden border-2 border-outline-variant/30 flex-shrink-0">
              <Image
                src={adventurer.avatar}
                alt={adventurer.avatarAlt}
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-headline font-bold text-3xl tracking-tight text-on-surface uppercase mb-1">
                Callsign: {adventurer.callsign}
              </h1>
              <p className="font-body text-tertiary text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Base: {adventurer.location}
              </p>
            </div>
            <div className="md:ml-auto flex flex-col items-end gap-2 mt-4 md:mt-0">
              <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-sm text-xs font-label uppercase tracking-widest">
                Rank: {adventurer.rank}
              </div>
              <div className="text-xs font-body text-tertiary">
                Member since {adventurer.memberSince}
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Expeditions (Orders) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="font-headline font-bold text-xl uppercase tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Recent Expeditions
            </h2>
            <div className="bg-surface-container-low p-6 rounded-sm flex flex-col gap-8">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row gap-6 group"
                >
                  <div className="w-full sm:w-32 h-24 bg-surface-container-highest rounded-sm overflow-hidden flex-shrink-0">
                    <Image
                      src={order.image}
                      alt={order.imageAlt}
                      width={128}
                      height={96}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-grow flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-headline font-semibold text-lg">
                        {order.name}
                      </h3>
                      <span className="font-body font-bold text-primary">
                        {order.price}
                      </span>
                    </div>
                    <p className="font-body text-sm text-tertiary mb-3">
                      Order #{order.id} • {order.status}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-label text-on-surface-variant uppercase tracking-wider">
                      {order.isComplete ? (
                        <span className="flex items-center gap-1 text-secondary">
                          <CheckCircle className="w-4 h-4" /> {order.trackingStatus}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Truck className="w-4 h-4" /> {order.trackingStatus}
                        </span>
                      )}
                      <Link
                        href="#"
                        className="text-secondary hover:text-secondary-fixed transition-colors"
                      >
                        {order.isComplete ? "View Invoice" : "Track Order"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Rig (Garage) */}
          <div className="flex flex-col gap-4">
            <h2 className="font-headline font-bold text-xl uppercase tracking-tight flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" /> My Rig
            </h2>
            <div className="bg-surface-container-high rounded-sm flex flex-col h-full">
              <div className="h-40 bg-surface-container-lowest relative overflow-hidden rounded-t-sm">
                <Image
                  src={rig.image}
                  alt={rig.imageAlt}
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute bottom-3 left-4 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 rounded-sm">
                  <span className="font-headline font-bold text-sm tracking-widest text-on-surface">
                    {rig.name}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-label text-xs text-tertiary uppercase tracking-wider block mb-1">
                      Engine
                    </span>
                    <span className="font-body text-sm font-semibold">
                      {rig.engine}
                    </span>
                  </div>
                  <div>
                    <span className="font-label text-xs text-tertiary uppercase tracking-wider block mb-1">
                      Suspension
                    </span>
                    <span className="font-body text-sm font-semibold">
                      {rig.suspension}
                    </span>
                  </div>
                  <div>
                    <span className="font-label text-xs text-tertiary uppercase tracking-wider block mb-1">
                      Tires
                    </span>
                    <span className="font-body text-sm font-semibold">
                      {rig.tires}
                    </span>
                  </div>
                  <div>
                    <span className="font-label text-xs text-tertiary uppercase tracking-wider block mb-1">
                      Status
                    </span>
                    <span className="font-body text-sm font-semibold text-secondary">
                      {rig.status}
                    </span>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-outline-variant/15">
                  <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold py-3 rounded-sm hover:brightness-110 transition-all uppercase tracking-wide text-sm flex justify-center items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Mod Specs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Area */}
        <section className="bg-surface-container-low p-6 rounded-sm mt-4 border border-outline-variant/15 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="font-headline font-bold text-lg mb-1">
              Plan Your Next Route
            </h3>
            <p className="font-body text-sm text-tertiary">
              Sync your rig&apos;s specs to find compatible overland trails.
            </p>
          </div>
          <button className="bg-transparent border border-outline/20 text-on-surface hover:bg-surface-container-high transition-colors font-headline font-bold py-3 px-6 rounded-sm uppercase tracking-wide text-sm whitespace-nowrap">
            Launch Map
          </button>
        </section>
      </main>
    </div>
  );
}
